from sklearn.linear_model import LinearRegression
import joblib
import os

BASE_DIR = os.path.dirname(__file__)

def train_traffic_model(df):
    X = df[["traffic_signal_norm"]]
    y = df["aqi_change"]

    model = LinearRegression()
    model.fit(X, y)

    beta = model.coef_[0]

    joblib.dump(model, os.path.join(BASE_DIR, "traffic_ai_model.pkl"))
    joblib.dump(beta, os.path.join(BASE_DIR, "traffic_to_aqi_beta.pkl"))

    return model, beta
