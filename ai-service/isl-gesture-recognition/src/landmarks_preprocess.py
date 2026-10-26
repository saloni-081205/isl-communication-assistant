# %% ==========================================================
# STEP 1 : Import Libraries
# ==========================================================

import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
import joblib
import random
from tqdm import tqdm

from config import *


# %% ==========================================================
# STEP 2 : Load Landmark CSV
# ==========================================================

print("=" * 60)
print("LOADING LANDMARK DATA")
print("=" * 60)

df = pd.read_csv(
    LANDMARK_CSV,
    low_memory=False,
    dtype={"label": "string"}
)

if "label" not in df.columns:
    raise KeyError(
        f"Expected a 'label' column in {LANDMARK_CSV}, "
        "but it was missing."
    )

print(f"Original Dataset Shape: {df.shape}")


# %% ==========================================================
# STEP 3 : Missing Values
# ==========================================================

print("\n" + "=" * 60)
print("CHECKING MISSING VALUES")
print("=" * 60)

missing_values = df.isnull().sum()

print(missing_values[missing_values > 0])

print("\nTotal Missing Values:", missing_values.sum())

if missing_values.sum() > 0:
    df.dropna(inplace=True)
    print("Rows with missing values dropped.")


# %% ==========================================================
# STEP 4 : Duplicate Rows
# ==========================================================

print("\n" + "=" * 60)
print("CHECKING DUPLICATES")
print("=" * 60)

duplicates = df.duplicated().sum()

print("Duplicate Rows:", duplicates)

if duplicates > 0:
    df.drop_duplicates(inplace=True)
    print("Duplicates Removed.")


print(f"Shape after cleaning: {df.shape}")


# %% ==========================================================
# STEP 5 : Handle Missing/Empty Labels
# ==========================================================

print("\n" + "=" * 60)
print("CHECKING LABELS")
print("=" * 60)

df["label"] = df["label"].astype("string").str.strip()

missing_label_rows = (
    df["label"].isna() |
    (df["label"] == "")
)

if missing_label_rows.any():

    print(
        f"Dropping {missing_label_rows.sum()} "
        "rows with missing/empty labels"
    )

    df = df.loc[~missing_label_rows].copy()


print(f"Dataset after cleaning: {df.shape}")


# %% ==========================================================
# STEP 6 : Label Encoding
# ==========================================================

print("\n" + "=" * 60)
print("LABEL ENCODING")
print("=" * 60)

encoder = LabelEncoder()

df["label"] = encoder.fit_transform(df["label"])

print("Number of classes:", len(encoder.classes_))

print("Classes:")

for index, class_name in enumerate(encoder.classes_):
    print(f"  {index}: {class_name}")


joblib.dump(encoder, LABEL_ENCODER)

print("\nLabel Encoder Saved:")
print(LABEL_ENCODER)


# %% ==========================================================
# STEP 7 : Separate Features and Labels
# ==========================================================

X = df.drop("label", axis=1)
y = df["label"]

X_np = X.to_numpy(dtype=np.float32)
y_np = y.to_numpy(dtype=np.int64)

print("\n" + "=" * 60)
print("FEATURE INFORMATION")
print("=" * 60)

print("Number of samples:", len(X_np))
print("Number of features:", X_np.shape[1])
print("Number of classes:", len(np.unique(y_np)))


# Verify feature count

if X_np.shape[1] != 128:

    raise ValueError(
        f"Expected 128 features, "
        f"but found {X_np.shape[1]}"
    )

print("✓ Feature count verified: 128")


# %% ==========================================================
# STEP 8 : ORIGINAL TRAIN / TEST SPLIT
# ==========================================================

print("\n" + "=" * 60)
print("TRAIN / TEST SPLIT")
print("=" * 60)

X_train_original, X_test, y_train_original, y_test = train_test_split(
    X_np,
    y_np,
    test_size=0.2,
    random_state=42,
    stratify=y_np
)

print(
    f"Original Training Samples: "
    f"{len(X_train_original)}"
)

print(
    f"Original Testing Samples: "
    f"{len(X_test)}"
)


# %% ==========================================================
# STEP 9 : DATA AUGMENTATION FUNCTION
# ==========================================================

def augment_landmarks(
    features,
    label,
    augmentation_factor=2
):

    augmented_data = []

    # Reshape:
    # 2 hands × 64 features
    features_2d = features.reshape(2, 64)

    for _ in range(augmentation_factor):

        augmented_features = features_2d.copy()

        # Process both hands
        for hand_idx in range(2):

            # Check if this hand is missing
            landmark_values = augmented_features[
                hand_idx, 1:
            ]

            if np.all(landmark_values == 0):
                continue

            # Get landmark positions
            landmarks = landmark_values.reshape(
                21, 3
            )

            # --------------------------------------------------
            # 1. Random Rotation
            # --------------------------------------------------

            if random.random() > 0.5:

                angle = (
                    np.random.uniform(-15, 15)
                    * np.pi / 180
                )

                rotation_matrix = np.array([
                    [
                        np.cos(angle),
                        -np.sin(angle),
                        0
                    ],
                    [
                        np.sin(angle),
                        np.cos(angle),
                        0
                    ],
                    [
                        0,
                        0,
                        1
                    ]
                ])

                landmarks = np.dot(
                    landmarks,
                    rotation_matrix
                )

            # --------------------------------------------------
            # 2. Random Scaling
            # --------------------------------------------------

            if random.random() > 0.5:

                scale = np.random.uniform(
                    0.9,
                    1.1
                )

                landmarks = landmarks * scale

            # --------------------------------------------------
            # 3. Random Translation
            # --------------------------------------------------

            if random.random() > 0.5:

                translation = np.random.uniform(
                    -0.05,
                    0.05,
                    3
                )

                landmarks = landmarks + translation

            # --------------------------------------------------
            # 4. Random Noise
            # --------------------------------------------------

            if random.random() > 0.5:

                noise = np.random.normal(
                    0,
                    0.02,
                    landmarks.shape
                )

                landmarks = landmarks + noise

            # Flatten landmarks
            augmented_features[
                hand_idx,
                1:
            ] = landmarks.flatten()

        augmented_data.append(
            [augmented_features.flatten(), label]
        )

    return augmented_data


# %% ==========================================================
# STEP 10 : AUGMENT TRAINING DATA ONLY
# ==========================================================

print("\n" + "=" * 60)
print("DATA AUGMENTATION")
print("=" * 60)

print(
    "IMPORTANT: Test data will NOT be augmented."
)

augmented_X = []
augmented_y = []

# Keep original training samples
for i in tqdm(
    range(len(X_train_original)),
    desc="Augmenting training data"
):

    features = X_train_original[i]

    label = y_train_original[i]

    # ----------------------------------------------------------
    # Original sample
    # ----------------------------------------------------------

    augmented_X.append(features)
    augmented_y.append(label)

    # ----------------------------------------------------------
    # Augmented samples
    # ----------------------------------------------------------

    aug_samples = augment_landmarks(
        features,
        label,
        augmentation_factor=2
    )

    for aug_features, aug_label in aug_samples:

        augmented_X.append(
            aug_features
        )

        augmented_y.append(
            aug_label
        )


# Convert to numpy

augmented_X_np = np.array(
    augmented_X,
    dtype=np.float32
)

augmented_y_np = np.array(
    augmented_y,
    dtype=np.int64
)


print("\nOriginal Training Data:")
print(len(X_train_original))

print("\nAugmented Training Data:")
print(len(augmented_X_np))

print(
    f"\nAugmentation multiplier: "
    f"{len(augmented_X_np) / len(X_train_original):.2f}x"
)

print(
    f"\nTesting data remains untouched: "
    f"{len(X_test)} samples"
)


# %% ==========================================================
# STEP 11 : Save Training and Testing Data
# ==========================================================

print("\n" + "=" * 60)
print("SAVING NUMPY ARRAYS")
print("=" * 60)

np.save(
    X_TRAIN,
    augmented_X_np
)

np.save(
    X_TEST,
    X_test
)

np.save(
    Y_TRAIN,
    augmented_y_np
)

np.save(
    Y_TEST,
    y_test
)

print("✓ X_train.npy saved")
print("✓ X_test.npy saved")
print("✓ y_train.npy saved")
print("✓ y_test.npy saved")


# %% ==========================================================
# STEP 12 : Final Summary
# ==========================================================

print("\n" + "=" * 60)
print("PREPROCESSING COMPLETED SUCCESSFULLY")
print("=" * 60)

print(
    f"Original Samples: "
    f"{len(X_np)}"
)

print(
    f"Original Features: "
    f"{X_np.shape[1]}"
)

print(
    f"Training Samples After Augmentation: "
    f"{len(augmented_X_np)}"
)

print(
    f"Testing Samples: "
    f"{len(X_test)}"
)

print(
    f"Number of Classes: "
    f"{len(encoder.classes_)}"
)


# %% ==========================================================
# STEP 13 : Class Distribution
# ==========================================================

unique, counts = np.unique(
    augmented_y_np,
    return_counts=True
)

print("\nAugmented Training Class Distribution:")

for class_idx, count in zip(unique, counts):

    class_name = encoder.inverse_transform(
        [class_idx]
    )[0]

    print(
        f"  {class_name}: {count}"
    )


print("\n" + "=" * 60)
print("ALL PREPROCESSING FILES READY")
print("=" * 60)