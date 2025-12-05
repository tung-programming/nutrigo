import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import RobustScaler
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
from catboost import CatBoostRegressor
import joblib
import warnings
import os

# Force immediate print output
print("Starting model training...")
import sys
sys.stdout.flush()

warnings.filterwarnings('ignore')

print("STEP 1: Loading dataset...")
sys.stdout.flush()
df = pd.read_csv('Indian_Packaged_Food.csv')
print("Dataset loaded successfully!")
print("Shape:", df.shape)
sys.stdout.flush()

print("STEP 2: Feature engineering...")
sys.stdout.flush()
df['protein_to_calorie_ratio'] = df['Protein_g_per_100g'] / (df['Calories_kcal_per_100g'] + 1)
df['fat_to_calorie_ratio'] = df['Fat_g_per_100g'] / (df['Calories_kcal_per_100g'] + 1)
df['sugar_to_carb_ratio'] = df['Sugar_g_per_100g'] / (df['Carbs_g_per_100g'] + 1)
df['macronutrient_balance'] = df['Protein_g_per_100g'] / (df['Fat_g_per_100g'] + df['Carbs_g_per_100g'] + 1)
df['calorie_density'] = df['Calories_kcal_per_100g'] / 100
df['total_macros'] = df['Protein_g_per_100g'] + df['Fat_g_per_100g'] + df['Carbs_g_per_100g']
print("Features engineered!")
sys.stdout.flush()

print("STEP 3: Train-test split...")
sys.stdout.flush()
X = df.drop('HealthScore_0_100', axis=1)
y = df['HealthScore_0_100']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
print("Train:", X_train.shape, "Test:", X_test.shape)
sys.stdout.flush()

print("STEP 4: Scaling...")
sys.stdout.flush()
scaler = RobustScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)
print("Scaling done!")
sys.stdout.flush()

print("STEP 5: Training CatBoost...")
sys.stdout.flush()

model = CatBoostRegressor(
    iterations=500,  # Reduced for faster training
    learning_rate=0.05,
    depth=6,
    loss_function='RMSE',
    eval_metric='R2',
    random_seed=42,
    verbose=50,  # Print every 50 iterations
    early_stopping_rounds=50
)

model.fit(X_train_scaled, y_train, eval_set=(X_test_scaled, y_test))
print("Model trained!")
sys.stdout.flush()

print("STEP 6: Evaluating...")
sys.stdout.flush()
y_pred = model.predict(X_test_scaled)
r2 = r2_score(y_test, y_pred)
rmse = np.sqrt(mean_squared_error(y_test, y_pred))
mae = mean_absolute_error(y_test, y_pred)

print("RESULTS:")
print("R2 Score:", round(r2, 4))
print("RMSE:", round(rmse, 4))
print("MAE:", round(mae, 4))
sys.stdout.flush()

print("STEP 7: Cross-validation...")
sys.stdout.flush()
cv_scores = cross_val_score(model, X_train_scaled, y_train, cv=3, scoring='r2')
print("CV R2 Mean:", round(cv_scores.mean(), 4))
sys.stdout.flush()

print("STEP 8: Saving models...")
sys.stdout.flush()
joblib.dump(model, 'health_score_catboost_model.pkl')
joblib.dump(scaler, 'health_score_scaler.pkl')
joblib.dump(list(X.columns), 'feature_columns.pkl')
print("Files saved!")
sys.stdout.flush()

print("\n" + "="*50)
print("FINAL SUMMARY")
print("="*50)
print("Model: CatBoost Regressor")
print("R2 Score:", round(r2, 4))
print("RMSE:", round(rmse, 4))
print("Files saved: 3 files")
print("Ready for Flask!")
print("="*50)

# Test prediction
print("\nTEST PREDICTION:")
print("-"*30)
test_sample = X_test.iloc[0:1]
test_scaled = scaler.transform(test_sample)
pred = model.predict(test_scaled)[0]
actual = y_test.iloc[0]
print("Actual:", actual)
print("Predicted:", pred)
print("Error:", abs(actual-pred))

print("\nTRAINING COMPLETE!")
sys.stdout.flush()
