import React from 'react';

function About() {
  return (
    <div className="about-container">
      <div className="about-content">
        <h2>About AI Vehicle Classifier</h2>
        
        <section className="about-section">
          <h3>What We Do</h3>
          <p>
            Our AI-powered vehicle classification system uses advanced machine learning
            algorithms to accurately identify and classify different types of vehicles
            from images. Whether it's cars, trucks, motorcycles, or other vehicles,
            our model provides quick and accurate results.
          </p>
        </section>

        <section className="about-section">
          <h3>How It Works</h3>
          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <h4>Upload Image</h4>
              <p>Select and upload any vehicle image you want to classify</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h4>Processing</h4>
              <p>Our AI model analyzes the image using deep learning techniques</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h4>Results</h4>
              <p>Get accurate vehicle classification results in seconds</p>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h3>Technology</h3>
          <p>
            Built with cutting-edge technologies including React, Python, and state-of-the-art
            deep learning models, our system provides reliable and efficient vehicle classification
            services.
          </p>
        </section>
      </div>
    </div>
  );
}

export default About; 