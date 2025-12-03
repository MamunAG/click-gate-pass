export default function useDevEnv() {
    const devEnv = "development";
    const productionEnv = "production";
    let currentEnv = import.meta.env.MODE;

    const appEnv = import.meta.env.VITE_APP_ENVIRONMENT;
    if (appEnv) {
        currentEnv = appEnv;
    }
    console.log('currentEnv:', currentEnv);
    // currentEnv = "production";

    return { currentEnv, devEnv, productionEnv };
}