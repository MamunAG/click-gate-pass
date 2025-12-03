export default function useAppClient() {
  const currentClient = import.meta.env.VITE_APP_CLIENT_NAME;

  const NUR = "NUR";
  const ICCL = "ICCL";
  const VERSATILE = "VERSATILE";
  const AG = "AG";
  const EURO = "EURO";
  const PRESENTATION = "PRESENTATION";
  const FAME = "FAME";

  const isFame = currentClient === FAME;
  const isPresentation = currentClient === PRESENTATION;
  const isEuro = currentClient === EURO;
  const isAg = currentClient === AG;
  const isVersatile = currentClient === VERSATILE;
  const isIccl = currentClient === ICCL;
  const isNur = currentClient === NUR;

  return {
    currentClient,
    NUR,
    ICCL,
    VERSATILE,
    AG,
    EURO,
    FAME,
    PRESENTATION,
    isFame,
    isPresentation,
    isEuro,
    isAg,
    isVersatile,
    isIccl,
    isNur
  };
}
