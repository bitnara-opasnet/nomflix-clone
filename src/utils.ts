import { useEffect, useState } from "react";

export function makeImagePath(id:string, format?: string) {
    return `https://image.tmdb.org/t/p/${format ? format : "original"}/${id}`
};

// 윈도우 면적width 추적하여 스크롤 뭉개짐 없도록
function getWindowDimensions() {
    const width = window.innerWidth;
    return width;
}
export function useWindowDimensions() {
    const [windowDimensions, setWindowDimensions] = useState(
        getWindowDimensions()
    );
    useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    return windowDimensions;
}
  