import torch
import torchvision.transforms as transforms
from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io
from torchvision import models
import torch.nn as nn

# Define the FastAPI app
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define the model class
class VehicleClassifier(nn.Module):
    def __init__(self, num_classes=10):
        super().__init__()
        self.model = models.resnet18(pretrained=True)
        self.model.fc = nn.Sequential(
            nn.Linear(self.model.fc.in_features, 512),
            nn.BatchNorm1d(512),
            nn.ReLU(),
            nn.Linear(512, num_classes)
        )

    def forward(self, x):
        return self.model(x)

    def predict(self, x):
        with torch.no_grad():
            output = self(x)
            return torch.argmax(output, dim=1)

# Initialize model and load weights
model_path = "vehicle_classifier.pt"
model = VehicleClassifier(num_classes=10)
model.load_state_dict(torch.load(model_path, map_location=torch.device('cpu')))
model.eval()

# Transformation for input images
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
])

# Class names
class_names = [
    "SUV", "Bus", "Family sedan", "Fire engine", "Heavy truck",
    "Jeep", "Minibus", "Racing car", "Taxi", "Truck"
]

@app.post("/predict/")
async def predict(file: UploadFile = File(...)):
    if file.content_type not in ["image/jpeg", "image/png"]:
        raise HTTPException(status_code=400, detail="Invalid image format. Only JPEG and PNG are supported.")

    try:
        # Load and preprocess the image
        img = Image.open(io.BytesIO(await file.read())).convert("RGB")
        img_tensor = transform(img).unsqueeze(0)

        # Predict class
        predicted_class = model.predict(img_tensor)
        return {
            "predicted_class": class_names[predicted_class.item()],
            "probability": torch.nn.functional.softmax(model(img_tensor), dim=1).max().item()
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing image: {e}")

@app.get("/")
async def read_root():
    return {"message": "Welcome to the Vehicle Classification API!"}
