from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class PredictionInput(BaseModel):
    hour: int
    day: str
    incident_count: int

@app.post("/api/ai/predict-traffic")
async def predict_traffic(data: PredictionInput):
    if data.incident_count >= 10 and data.hour in [7,8,9,16,17,18,19]:
        result = "embouteillage probable"
    else:
        result = "trafic fluide"

    return {
        "result": result,
        "input": data
    }
