import { useState, useRef, useEffect } from 'react';
import { Camera, Upload, X, Crop, RotateCw, Download } from 'lucide-react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { API_ENDPOINTS } from '../config/api';

const ImageUpload = ({ onImageUpload, maxSize = 120 * 1024 }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const [isCropping, setIsCropping] = useState(false);
  const [uploadMethod, setUploadMethod] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState('checking');
  const fileInputRef = useRef();
  const videoRef = useRef();
  const canvasRef = useRef();

  // Check backend connectivity on component mount
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch(`${API_ENDPOINTS.ADMIN_LOGIN.replace('/login', '/test')}`);
        if (response.ok) {
          setBackendStatus('connected');
          console.log('Backend is accessible');
        } else {
          setBackendStatus('error');
          console.error('Backend check failed:', response.status);
        }
      } catch (error) {
        setBackendStatus('error');
        console.error('Backend connectivity error:', error);
      }
    };
    
    checkBackend();
  }, []);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
        setCrop(undefined);
        setCompletedCrop(undefined);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setUploadMethod('camera');
    } catch (error) {
      console.error('Camera access denied:', error);
      alert('Camera access denied. Please allow camera access to take a photo.');
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);
      
      const imageDataUrl = canvasRef.current.toDataURL('image/jpeg');
      setSelectedImage(imageDataUrl);
      setUploadMethod(null);
      
      // Stop camera stream
      if (videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    }
  };

  const handleCropComplete = (crop, pixelCrop) => {
    setCompletedCrop(pixelCrop);
  };

  const getCroppedImg = (imageSrc, pixelCrop) => {
    return new Promise((resolve) => {
      const image = new Image();
      image.src = imageSrc;
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;

        ctx.drawImage(
          image,
          pixelCrop.x,
          pixelCrop.y,
          pixelCrop.width,
          pixelCrop.height,
          0,
          0,
          pixelCrop.width,
          pixelCrop.height
        );

        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/jpeg', 0.8);
      };
    });
  };

  const handleUpload = async () => {
    if (!selectedImage) return;

    setIsLoading(true);
    try {
      let imageBlob;
      
      if (completedCrop && isCropping) {
        // Use cropped image
        imageBlob = await getCroppedImg(selectedImage, completedCrop);
      } else {
        // Use original image
        const response = await fetch(selectedImage);
        imageBlob = await response.blob();
      }

      // Check file size
      if (imageBlob.size > maxSize) {
        alert(`Image size (${Math.round(imageBlob.size / 1024)}KB) exceeds the maximum allowed size (${Math.round(maxSize / 1024)}KB). Please crop or compress the image.`);
        setIsLoading(false);
        return;
      }

      // Create FormData for upload
      const formData = new FormData();
      formData.append('image', imageBlob, 'product-image.jpg');

      // Get admin token
      const adminToken = localStorage.getItem('adminToken');
      const uploadUrl = adminToken ? API_ENDPOINTS.ADMIN_UPLOAD : API_ENDPOINTS.ADMIN_UPLOAD_TEST;

      console.log('Attempting upload to:', uploadUrl);
      console.log('Admin token present:', !!adminToken);

      // Upload to backend
      const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: adminToken ? {
          'Authorization': `Bearer ${adminToken}`
        } : {},
        body: formData
      });

      console.log('Upload response status:', response.status);
      console.log('Upload response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Upload failed:', errorText);
        throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Upload result:', result);
      
      if (result.success) {
        onImageUpload(result.imageUrl);
        setSelectedImage(null);
        setCrop(undefined);
        setCompletedCrop(undefined);
        setIsCropping(false);
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert(`Upload failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const resetImage = () => {
    setSelectedImage(null);
    setCrop(undefined);
    setCompletedCrop(undefined);
    setIsCropping(false);
    setUploadMethod(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {/* Backend Status */}
      <div className={`text-sm p-2 rounded ${
        backendStatus === 'connected' ? 'bg-green-600 text-white' :
        backendStatus === 'error' ? 'bg-red-600 text-white' :
        'bg-yellow-600 text-white'
      }`}>
        Backend Status: {
          backendStatus === 'connected' ? 'Connected' :
          backendStatus === 'error' ? 'Connection Failed' :
          'Checking...'
        }
      </div>

      {/* Upload Methods */}
      {!selectedImage && !uploadMethod && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-gray-600 rounded-lg hover:border-gray-400 transition-colors"
          >
            <Upload className="w-6 h-6" />
            <span>Upload from Device</span>
          </button>
          
          <button
            onClick={handleCameraCapture}
            className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-gray-600 rounded-lg hover:border-gray-400 transition-colors"
          >
            <Camera className="w-6 h-6" />
            <span>Take Photo</span>
          </button>
        </div>
      )}

      {/* Camera Interface */}
      {uploadMethod === 'camera' && (
        <div className="space-y-4">
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full max-w-md mx-auto rounded-lg"
            />
            <canvas ref={canvasRef} className="hidden" />
          </div>
          <div className="flex justify-center space-x-4">
            <button
              onClick={capturePhoto}
              className="btn bg-white text-black hover:bg-gray-200"
            >
              <Camera className="w-4 h-4 mr-2" />
              Capture Photo
            </button>
            <button
              onClick={() => {
                setUploadMethod(null);
                if (videoRef.current?.srcObject) {
                  videoRef.current.srcObject.getTracks().forEach(track => track.stop());
                }
              }}
              className="btn btn-outline"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Image Preview and Crop */}
      {selectedImage && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Image Preview</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsCropping(!isCropping)}
                className={`btn btn-sm ${isCropping ? 'bg-blue-600' : 'bg-gray-600'}`}
              >
                <Crop className="w-4 h-4 mr-2" />
                {isCropping ? 'Done Cropping' : 'Crop Image'}
              </button>
              <button
                onClick={resetImage}
                className="btn btn-sm btn-outline"
              >
                <X className="w-4 h-4 mr-2" />
                Reset
              </button>
            </div>
          </div>

          <div className="relative max-w-md mx-auto">
            {isCropping ? (
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={handleCropComplete}
                aspect={1}
                minWidth={400}
                minHeight={400}
                keepSelection={true}
                className="max-w-full"
              >
                <img
                  src={selectedImage}
                  alt="Crop preview"
                  className="max-w-full rounded-lg"
                  style={{ maxHeight: '500px', objectFit: 'contain' }}
                />
              </ReactCrop>
            ) : (
              <img
                src={selectedImage}
                alt="Preview"
                className="max-w-full rounded-lg"
                style={{ maxHeight: '500px', objectFit: 'contain' }}
              />
            )}
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={handleUpload}
              disabled={isLoading}
              className="btn bg-white text-black hover:bg-gray-200 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="loading loading-spinner loading-sm"></div>
              ) : (
                <Upload className="w-4 h-4 mr-2" />
              )}
              {isLoading ? 'Uploading...' : 'Upload Image'}
            </button>
          </div>

          <div className="text-center text-sm text-gray-400">
            Maximum file size: {Math.round(maxSize / 1024)}KB
            {completedCrop && isCropping && (
              <div className="mt-2">
                Cropped size: {completedCrop.width} × {completedCrop.height}px
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};

export default ImageUpload; 