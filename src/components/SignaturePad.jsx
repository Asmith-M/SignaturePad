import React, { useRef, useState, useEffect } from "react";

const SignaturePad = () => {
  const canvasRef = useRef(null);
  const [fontColor, setFontColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [lineWidth, setLineWidth] = useState(5);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = fontColor;
    ctx.fillStyle = bgColor;
  }, [fontColor, lineWidth, bgColor]);

  const startDrawing = (e) => {
    const offsetX = e.nativeEvent.offsetX || e.touches[0].clientX - e.target.offsetLeft;
    const offsetY = e.nativeEvent.offsetY || e.touches[0].clientY - e.target.offsetTop;
    setIsDrawing(true);
    setLastPos({ x: offsetX, y: offsetY });
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const offsetX = e.nativeEvent.offsetX || e.touches[0].clientX - e.target.offsetLeft;
    const offsetY = e.nativeEvent.offsetY || e.touches[0].clientY - e.target.offsetTop;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.strokeStyle = fontColor;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
    setLastPos({ x: offsetX, y: offsetY });
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleBgChange = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = e.target.value;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setBgColor(e.target.value);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveCanvas = () => {
    const canvas = canvasRef.current;
    localStorage.setItem("canvasContents", canvas.toDataURL());

    const link = document.createElement("a");
    link.download = "my-canvas.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  const retrieveCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const savedCanvas = localStorage.getItem("canvasContents");

    if (savedCanvas) {
      const img = new Image();
      img.src = savedCanvas;
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
      };
    }
  };

  return (
    <div className="container text-center" style={{ paddingTop: "50px" }}>
      <div className="d-flex justify-content-around mb-4">
        <div>
          <p>Font Color</p>
          <input
            className="form-control"
            type="color"
            value={fontColor}
            onChange={(e) => setFontColor(e.target.value)}
          />
        </div>
        <div>
          <p>Background Color</p>
          <input
            className="form-control"
            type="color"
            value={bgColor}
            onChange={handleBgChange}
          />
        </div>
        <div>
          <p>Font Size</p>
          <select
            className="form-control"
            value={lineWidth}
            onChange={(e) => setLineWidth(parseInt(e.target.value))}
          >
            <option value="5">5px</option>
            <option value="10">10px</option>
            <option value="20">20px</option>
            <option value="30">30px</option>
            <option value="40">40px</option>
          </select>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        width="800"
        height="500"
        className="border border-dark"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      ></canvas>
      <div className="d-flex justify-content-around mt-4">
        <button className="btn btn-danger" onClick={clearCanvas}>
          Clear
        </button>
        <button className="btn btn-success" onClick={saveCanvas}>
          Save and Download
        </button>
        <button className="btn btn-warning" onClick={retrieveCanvas}>
          Retrieve Saved Signature
        </button>
      </div>
    </div>
  );
};

export default SignaturePad;
