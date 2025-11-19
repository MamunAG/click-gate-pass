export default function useDevEnv() {
    const devEnv = "development";
    const productionEnv = "production";
    let currentEnv = import.meta.env.MODE;
    // console.log('currentEnv:', currentEnv);
    currentEnv = "production";

    return { currentEnv, devEnv, productionEnv };
}