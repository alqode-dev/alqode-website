import { lazy, Suspense } from "react";
import "./App.css";

const CharacterModel = lazy(() => import("./components/Character"));
const MainContainer = lazy(() => import("./components/MainContainer"));
import { LoadingProvider } from "./context/LoadingProvider";

// Branded loading fallback component
const AppFallback = () => (
  <div className="app-fallback">
    <div className="app-fallback-logo">
      <span className="logo-bracket">{"{"}</span>
      alqode
      <span className="logo-bracket">{"}"}</span>
    </div>
    <div className="app-fallback-spinner"></div>
  </div>
);

const App = () => {
  return (
    <>
      <LoadingProvider>
        <Suspense fallback={<AppFallback />}>
          <MainContainer>
            <Suspense fallback={null}>
              <CharacterModel />
            </Suspense>
          </MainContainer>
        </Suspense>
      </LoadingProvider>
    </>
  );
};

export default App;
