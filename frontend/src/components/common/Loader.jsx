
import "../../style/Loader.css";

function Loader({ text = "Loading...", fullScreen = false }) {
  return (
    <div className={`app-loader ${fullScreen ? "loader-fullscreen" : ""}`}>
      <div className="loader-content">
        <div className="loader-ring">
          <span></span>
        </div>

        <p>{text}</p>
      </div>
    </div>
  );
}

export default Loader;
