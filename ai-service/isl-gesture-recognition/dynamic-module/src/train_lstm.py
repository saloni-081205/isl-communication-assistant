
# %% ==========================================================
# STEP 1: Imports
# ==========================================================
import numpy as np
import matplotlib.pyplot as plt
import joblib
import tensorflow as tf  # type: ignore

from tensorflow.keras.models import Sequential  # type: ignore
from tensorflow.keras.layers import (
    LSTM, Dense, Dropout, BatchNormalization, Input
)
from tensorflow.keras.callbacks import (
    EarlyStopping, ReduceLROnPlateau, ModelCheckpoint
)
from tensorflow.keras.optimizers import Adam  # type: ignore
from tensorflow.keras.utils import to_categorical  # type: ignore

from sklearn.metrics import (
    classification_report,
    confusion_matrix,
    ConfusionMatrixDisplay,
    accuracy_score,
    f1_score,
    precision_score,
    recall_score
)

from config import *


# %% ==========================================================
# STEP 2: Load preprocessed sequences
# ==========================================================

# Training data: original sequences plus augmented copies
X_train = np.load(DYNAMIC_X_TRAIN)
y_train = np.load(DYNAMIC_Y_TRAIN)

# Validation data: original sequences only
X_val = np.load(CSV_FOLDER / "dynamic_X_val.npy")
y_val = np.load(CSV_FOLDER / "dynamic_y_val.npy")

# Test data: original sequences only
X_test = np.load(DYNAMIC_X_TEST)
y_test = np.load(DYNAMIC_Y_TEST)

# Load label encoder and class weights
encoder = joblib.load(DYNAMIC_LABEL_ENCODER)
class_weights = joblib.load(DYNAMIC_CLASS_WEIGHTS)

num_classes = len(encoder.classes_)

print("\n========== DATASET INFORMATION ==========")
print("Training data:  ", X_train.shape, y_train.shape)
print("Validation data:", X_val.shape, y_val.shape)
print("Testing data:   ", X_test.shape, y_test.shape)
print("Number of classes:", num_classes)
print("Class names:", encoder.classes_)


# %% ==========================================================
# STEP 3: Validate datasets
# ==========================================================

expected_shape = (SEQUENCE_LENGTH, FEATURES_PER_FRAME)

datasets = [
    ("Training", X_train, y_train),
    ("Validation", X_val, y_val),
    ("Testing", X_test, y_test)
]

for name, X, y in datasets:

    # Check feature dimensions
    if X.ndim != 3 or X.shape[1:] != expected_shape:
        raise ValueError(
            f"{name} data has incorrect shape: {X.shape}. "
            f"Expected (samples, {SEQUENCE_LENGTH}, "
            f"{FEATURES_PER_FRAME})."
        )

    # Check number of sequences and labels
    if len(X) != len(y):
        raise ValueError(
            f"{name}: number of sequences and labels does not match."
        )

    # Check for NaN and infinity
    if not np.isfinite(X).all():
        raise ValueError(
            f"{name} features contain NaN or infinity."
        )

    # Check that labels are valid encoded class IDs
    if not np.isin(y, np.arange(num_classes)).all():
        raise ValueError(
            f"{name} labels contain invalid class IDs."
        )

print("\nDataset validation passed.")
print("All feature shapes and labels are valid.")


# %% ==========================================================
# STEP 4: One-hot encode labels
# ==========================================================

y_train_cat = to_categorical(y_train, num_classes=num_classes)
y_val_cat = to_categorical(y_val, num_classes=num_classes)
y_test_cat = to_categorical(y_test, num_classes=num_classes)

print("\n========== LABEL INFORMATION ==========")
print("Training labels:", y_train_cat.shape)
print("Validation labels:", y_val_cat.shape)
print("Testing labels:", y_test_cat.shape)


# %% ==========================================================
# STEP 5: Build LSTM model
# ==========================================================

def build_model(seq_len, n_feat, n_classes):

    model = Sequential([
        Input(shape=(seq_len, n_feat)),

        LSTM(64, return_sequences=True, activation="tanh"),
        BatchNormalization(),
        Dropout(LSTM_DROPOUT),

        LSTM(128, return_sequences=True, activation="tanh"),
        BatchNormalization(),
        Dropout(LSTM_DROPOUT),

        LSTM(64, return_sequences=False, activation="tanh"),
        BatchNormalization(),
        Dropout(LSTM_DROPOUT),

        Dense(64, activation="relu"),
        Dropout(0.3),

        Dense(32, activation="relu"),

        Dense(n_classes, activation="softmax")
    ])

    model.compile(
        optimizer=Adam(learning_rate=LSTM_LEARNING_RATE),
        loss="categorical_crossentropy",
        metrics=["accuracy"]
    )

    return model


model = build_model(
    SEQUENCE_LENGTH,
    FEATURES_PER_FRAME,
    num_classes
)

model.summary()


# %% ==========================================================
# STEP 6: Configure callbacks
# ==========================================================

callbacks = [

    EarlyStopping(
        monitor="val_loss",
        patience=LSTM_EARLY_STOPPING_PATIENCE,
        restore_best_weights=True,
        mode="min",
        verbose=1
    ),

    ReduceLROnPlateau(
        monitor="val_loss",
        factor=0.5,
        patience=5,
        min_lr=1e-6,
        mode="min",
        verbose=1
    ),

    ModelCheckpoint(
        filepath=str(LSTM_MODEL),
        monitor="val_loss",
        save_best_only=True,
        mode="min",
        verbose=1
    )
]


# %% ==========================================================
# STEP 7: Train LSTM model
# ==========================================================

print("\n========== STARTING LSTM TRAINING ==========")

history = model.fit(
    X_train,
    y_train_cat,

    # Use the separate validation dataset
    validation_data=(X_val, y_val_cat),

    epochs=LSTM_EPOCHS,
    batch_size=LSTM_BATCH_SIZE,

    callbacks=callbacks,
    class_weight=class_weights,

    verbose=1
)

print("\nTraining completed.")


# %% ==========================================================
# STEP 8: Evaluate on the test dataset
# ==========================================================

print("\n========== FINAL TEST EVALUATION ==========")

# Evaluate the final model using unseen test sequences
test_loss, test_accuracy = model.evaluate(
    X_test,
    y_test_cat,
    verbose=1
)

# Predict test classes
y_pred_proba = model.predict(X_test, verbose=1)
y_pred = np.argmax(y_pred_proba, axis=1)

# Original encoded test labels
y_true = y_test

# Calculate evaluation metrics
acc = accuracy_score(y_true, y_pred)

precision = precision_score(
    y_true,
    y_pred,
    average="macro",
    zero_division=0
)

recall = recall_score(
    y_true,
    y_pred,
    average="macro",
    zero_division=0
)

f1 = f1_score(
    y_true,
    y_pred,
    average="macro",
    zero_division=0
)

print(f"\nTest Loss:       {test_loss:.4f}")
print(f"Test Accuracy:   {acc:.4f} ({acc * 100:.2f}%)")
print(f"Macro Precision: {precision:.4f}")
print(f"Macro Recall:    {recall:.4f}")
print(f"Macro F1 Score:  {f1:.4f}")


# %% ==========================================================
# STEP 9: Classification report
# ==========================================================

report = classification_report(
    y_true,
    y_pred,
    labels=np.arange(num_classes),
    target_names=[str(name) for name in encoder.classes_],
    zero_division=0
)

print("\n========== CLASSIFICATION REPORT ==========")
print(report)

with open(LSTM_CLASSIFICATION_REPORT, "w", encoding="utf-8") as f:

    f.write(f"Test Loss: {test_loss:.4f}\n")
    f.write(f"Accuracy: {acc:.4f}\n")
    f.write(f"Macro Precision: {precision:.4f}\n")
    f.write(f"Macro Recall: {recall:.4f}\n")
    f.write(f"Macro F1: {f1:.4f}\n\n")

    f.write(report)


# %% ==========================================================
# STEP 10: Plot training history
# ==========================================================

fig, axes = plt.subplots(1, 2, figsize=(14, 5))

# Accuracy plot
axes[0].plot(
    history.history["accuracy"],
    label="Training Accuracy"
)

axes[0].plot(
    history.history["val_accuracy"],
    label="Validation Accuracy"
)

axes[0].set_title("LSTM Model Accuracy")
axes[0].set_xlabel("Epoch")
axes[0].set_ylabel("Accuracy")
axes[0].legend()
axes[0].grid(True, alpha=0.3)

# Loss plot
axes[1].plot(
    history.history["loss"],
    label="Training Loss"
)

axes[1].plot(
    history.history["val_loss"],
    label="Validation Loss"
)

axes[1].set_title("LSTM Model Loss")
axes[1].set_xlabel("Epoch")
axes[1].set_ylabel("Loss")
axes[1].legend()
axes[1].grid(True, alpha=0.3)

plt.tight_layout()
plt.savefig(LSTM_TRAIN_HISTORY, dpi=150)
plt.show()


# %% ==========================================================
# STEP 11: Confusion matrix
# ==========================================================

cm = confusion_matrix(
    y_true,
    y_pred,
    labels=np.arange(num_classes)
)

fig, ax = plt.subplots(figsize=(16, 14))

ConfusionMatrixDisplay(
    confusion_matrix=cm,
    display_labels=encoder.classes_
).plot(
    ax=ax,
    xticks_rotation=90,
    cmap="Blues",
    colorbar=False
)

plt.title(f"LSTM Confusion Matrix — Accuracy: {acc:.4f}")
plt.tight_layout()
plt.savefig(LSTM_CONFUSION_MATRIX, dpi=150)
plt.show()


# %% ==========================================================
# STEP 12: Final summary
# ==========================================================

print("\n========== TRAINING SUMMARY ==========")
print(f"Best model path: {LSTM_MODEL}")
print(f"Training history: {LSTM_TRAIN_HISTORY}")
print(f"Confusion matrix: {LSTM_CONFUSION_MATRIX}")
print(f"Classification report: {LSTM_CLASSIFICATION_REPORT}")
print("\nDynamic gesture LSTM training pipeline finished.")
