# %% ==========================================================
# STEP 1 : Imports
# ==========================================================
import numpy as np
import joblib
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from tqdm import tqdm
from config import *
from sklearn.utils.class_weight import compute_class_weight


# ==========================================================
# STEP 2: Load and validate extracted sequences
# ==========================================================

X = np.load(DYNAMIC_SEQUENCE_FOLDER / "X_sequences.npy")
y_labels = np.load(
    DYNAMIC_SEQUENCE_FOLDER / "y_labels.npy",
    allow_pickle=True
)

print(f"Loaded X: {X.shape}")
print(f"Loaded y: {y_labels.shape}")
print(f"Classes: {len(np.unique(y_labels))}")

# Check that the dataset is not empty
if len(X) == 0 or len(y_labels) == 0:
    raise ValueError(
        "The extracted dataset is empty. "
        "Run extract_landmarks_video.py successfully first."
    )

# Check sequence dimensions
if X.ndim != 3:
    raise ValueError(
        f"Expected a 3D dataset, but received shape {X.shape}"
    )

if X.shape[1:] != (SEQUENCE_LENGTH, FEATURES_PER_FRAME):
    raise ValueError(
        f"Incorrect sequence shape: {X.shape}. "
        f"Expected (samples, {SEQUENCE_LENGTH}, "
        f"{FEATURES_PER_FRAME})."
    )

# Every sequence must have one corresponding label
if len(X) != len(y_labels):
    raise ValueError(
        f"Number of sequences ({len(X)}) does not match "
        f"number of labels ({len(y_labels)})."
    )

# Every class needs at least two recordings for stratified splitting
unique_labels, label_counts = np.unique(
    y_labels, return_counts=True
)

classes_with_too_few_samples = unique_labels[label_counts < 2]

if len(classes_with_too_few_samples) > 0:
    raise ValueError(
        "These gesture classes have fewer than two videos: "
        f"{classes_with_too_few_samples.tolist()}. "
        "Add more recordings before splitting."
    )


# %% ==========================================================
# STEP 3 : Encode labels
# ==========================================================
encoder = LabelEncoder()
y = encoder.fit_transform(y_labels)
joblib.dump(encoder, DYNAMIC_LABEL_ENCODER)
print(f"Label encoder saved → {DYNAMIC_LABEL_ENCODER}")
print(f"Classes: {list(encoder.classes_)}")


# %% ==========================================================
# STEP 4: Split original videos into train, validation and test
# ==========================================================
# Split the original data before augmentation so augmented copies
# cannot leak into validation or test data.

X_trainval_orig, X_test_orig, y_trainval_orig, y_test_orig = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

# Use 20% of the remaining 80% for validation.
# Final proportions: 64% train, 16% validation, 20% test.
X_train_orig, X_val_orig, y_train_orig, y_val_orig = train_test_split(
    X_trainval_orig,
    y_trainval_orig,
    test_size=0.20,
    random_state=42,
    stratify=y_trainval_orig
)

print(f"\nOriginal Train:      {X_train_orig.shape}")
print(f"Original Validation: {X_val_orig.shape}")
print(f"Original Test:       {X_test_orig.shape}")


# %% ==========================================================
# STEP 5: Augmentation function
# ==========================================================

def augment_sequence(seq, factor=4):
    """Augment one sequence of shape (90, 128)."""

    augmented = []
    T, F = seq.shape

    if F != FEATURES_PER_FRAME or T != SEQUENCE_LENGTH:
        raise ValueError(f"Unexpected sequence shape: {seq.shape}")

    for _ in range(factor):
        aug = seq.copy()

        # Temporal shift without circular wrapping
        shift = np.random.randint(-5, 6)
        indices = np.clip(np.arange(T) + shift, 0, T - 1)
        aug = aug[indices].copy()

        # Left-hand coordinates: 1:64
        # Right-hand coordinates: 65:128
        for hand_offset in (1, 65):
            for frame_idx in range(T):
                hand = aug[
                    frame_idx, hand_offset:hand_offset + 63
                ].reshape(21, 3)

                # Preserve missing hands as zeros
                if not np.any(np.abs(hand) > 1e-7):
                    continue

                hand += np.random.normal(
                    0, 0.005, hand.shape
                ).astype(np.float32)

                hand *= np.random.uniform(0.95, 1.05)

                angle = np.deg2rad(np.random.uniform(-10, 10))
                cos_a, sin_a = np.cos(angle), np.sin(angle)

                x_coords = hand[:, 0].copy()
                y_coords = hand[:, 1].copy()

                hand[:, 0] = cos_a * x_coords - sin_a * y_coords
                hand[:, 1] = sin_a * x_coords + cos_a * y_coords

        augmented.append(aug.astype(np.float32))

    return augmented


# %% ==========================================================
# STEP 6: Augment training data ONLY
# ==========================================================

print("\nAugmenting training set only...")

X_train_list = []
y_train_list = []

for i in tqdm(range(len(X_train_orig))):
    # Keep the original training sequence
    X_train_list.append(X_train_orig[i])
    y_train_list.append(y_train_orig[i])

    # Add augmented copies
    augmented_sequences = augment_sequence(
        X_train_orig[i],
        factor=DYNAMIC_AUGMENTATION_FACTOR
    )

    for aug_seq in augmented_sequences:
        X_train_list.append(aug_seq)
        y_train_list.append(y_train_orig[i])

X_train_final = np.stack(X_train_list).astype(np.float32)
y_train_final = np.asarray(y_train_list, dtype=np.int64)

# Validation and test data remain original and unaugmented
X_val_final = X_val_orig.astype(np.float32)
y_val_final = np.asarray(y_val_orig, dtype=np.int64)

X_test_final = X_test_orig.astype(np.float32)
y_test_final = np.asarray(y_test_orig, dtype=np.int64)

print(f"\nFinal Train:      {X_train_final.shape}")
print(f"Final Validation: {X_val_final.shape}")
print(f"Final Test:       {X_test_final.shape}")


# %% ==========================================================
# STEP 7: Save all prepared datasets
# ==========================================================

np.save(DYNAMIC_X_TRAIN, X_train_final)
np.save(DYNAMIC_Y_TRAIN, y_train_final)

# New validation files, kept inside dynamic-module/csv
np.save(CSV_FOLDER / "dynamic_X_val.npy", X_val_final)
np.save(CSV_FOLDER / "dynamic_y_val.npy", y_val_final)

np.save(DYNAMIC_X_TEST, X_test_final)
np.save(DYNAMIC_Y_TEST, y_test_final)

print("\nSaved training, validation and testing arrays.")


# %% ==========================================================
# STEP 8: Compute class weights from ORIGINAL training samples
# ==========================================================
# Use original training labels, not augmented labels, to avoid
# making the class distribution depend on augmentation counts.

classes_present = np.unique(y_train_orig)

class_weights_array = compute_class_weight(
    class_weight="balanced",
    classes=classes_present,
    y=y_train_orig
)

class_weights = {
    int(c): float(w)
    for c, w in zip(classes_present, class_weights_array)
}

joblib.dump(
    class_weights,
    DYNAMIC_CLASS_WEIGHTS
)

print("\nClass weights saved:", DYNAMIC_CLASS_WEIGHTS)
print(f"Minimum class weight: {min(class_weights.values()):.3f}")
print(f"Maximum class weight: {max(class_weights.values()):.3f}")
