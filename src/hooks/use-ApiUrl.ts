import useDevEnv from "./use-DevEnv";

export default function useApiUrl() {
  const { currentEnv, devEnv } = useDevEnv();

  const DevUrl = "http://localhost:5104/api";
  const DevRootUrl = "http://localhost:5104";

  let ProductionUrl = "http://119.148.62.103:6503/api";
  let ProductionRootUrl = "http://119.148.62.103:6503";

  // let ProductionUrl = "http://103.95.98.115:6307/api";
  // let ProductionRootUrl = "http://103.95.98.115:6307";


  // let ProductionUrl = "http://api-nextappbd.runasp.net/api";
  // let ProductionRootUrl = "http://api-nextappbd.runasp.net"; h

  if (currentEnv === devEnv) {
    ProductionUrl = DevUrl;
    ProductionRootUrl = DevRootUrl;
  }

  return { ProductionUrl, ProductionRootUrl };
}
