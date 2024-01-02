import styles from "./Loader.module.css"

export default ({width="200px", height="200px"}) => {
    return (
        // @ts-ignore
        <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" className={StyleSheet.Loader} width={width} height={height} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
            <circle cx="50" cy="50" r="32" stroke-width="8" stroke="#1d3f72" strokeDasharray="50.26548245743669 50.26548245743669" fill="none" strokeLinecap="round">
                <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" keyTimes="0;1" values="0 50 50;360 50 50"></animateTransform>
            </circle>
        </svg>
    )
}