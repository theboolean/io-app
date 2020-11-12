// import { fromNullable } from "fp-ts/lib/Either";
import { debug } from "console";
import React from "react";
import { View } from "react-native";
import { render } from "@testing-library/react-native";
// import { PersistGate } from "redux-persist/integration/react";

import { Provider } from "react-redux";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
// import { createStackNavigator } from "react-navigation";
// import { createAppContainer } from "react-navigation";
import { mockReactRedux } from "mock-react-redux";
// import WalletNavigator from "../../../navigation/WalletNavigator";
// import { mockConnect } from "../../../utils/mockReduxUtils";
// import { withNavigation } from "react-navigation";
import { NavigationInjectedProps } from "react-navigation";
import AddCardScreen from "../AddCardScreen";
// import RootContainer from "../../../RootContainer";
// import rootSaga from "../../../sagas";
import { configureCustomMockStore } from "../../../boot/configureStoreAndPersistor";

// import { GlobalState } from "../../../store/reducers/types";
// const testContainer = createAppContainer(WalletNavigator);

// Jest Configuration

jest.useFakeTimers();

// Navigation mocks

function mockWithNavigation<P extends Record<string, unknown>>(
  Component: React.ComponentType<P>
): React.FC<P & NavigationInjectedProps> {
  return (props: P) => <Component navigation={jest.fn()} {...props} />;
}

jest.mock("react-navigation", () => ({
  withNavigation: mockWithNavigation,
  StackActions: { reset: jest.fn() },
  NavigationActions: { navigate: jest.fn() },
  NavigationEvents: "mockNavigationEvents"
}));

// Relies on @react-navigation (scoped package) not on react-navigation
// which have different versions
const Stack = createStackNavigator();
const MockedNavigator = ({ component, params = {} }: any) => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen
        name="MockedScreen"
        component={component}
        initialParams={params}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

// React Native mocks

jest.mock("react-native-background-timer", () => ({
  BackgroundTimer: { setTimeout: jest.fn },
  startTimer: jest.fn()
}));
jest.mock("react-native-share", () => ({
  open: jest.fn()
}));
jest.mock("react-native-view-shot", () => jest.fn());
jest.mock("react-native-keyboard-aware-scroll-view", () => {
  const KeyboardAwareHOC = ({ children }: { children: any }) => children;
  const KeyboardAwareScrollView = ({ children }: { children: any }) => children;

  const listenToKeyboardEvents = jest.fn();
  return { KeyboardAwareScrollView, KeyboardAwareHOC, listenToKeyboardEvents };
});

// Provider: ({children}) => children

const initState = {
  // appState: { appState: "active" },
  network: { isConnected: true, actionQueue: [], isQueuePaused: false },
  // nav: {
  //   key: "StackRouterRoot",
  //   isTransitioning: false,
  //   index: 0,
  //   routes: [
  //     {
  //       routes: [
  //         {
  //           key: "MESSAGES_NAVIGATOR",
  //           isTransitioning: false,
  //           index: 0,
  //           routes: [{ routeName: "MESSAGES_HOME", key: "id-1604446084902-1" }],
  //           routeName: "MESSAGES_NAVIGATOR"
  //         },
  //         {
  //           key: "WALLET_HOME",
  //           isTransitioning: false,
  //           index: 2,
  //           routes: [
  //             { routeName: "WALLET_HOME", key: "id-1604446084902-2" },
  //             {
  //               params: {
  //                 inPayment: { _tag: "None" },
  //                 keyFrom: "id-1604446084902-2"
  //               },
  //               routeName: "WALLET_ADD_PAYMENT_METHOD",
  //               key: "id-1604446084902-6"
  //             },
  //             {
  //               params: {
  //                 inPayment: { _tag: "None" },
  //                 keyFrom: "id-1604446084902-2"
  //               },
  //               routeName: "WALLET_ADD_CARD",
  //               key: "id-1604446084902-7"
  //             }
  //           ],
  //           routeName: "WALLET_HOME"
  //         },
  //         {
  //           key: "SERVICES_NAVIGATOR",
  //           isTransitioning: false,
  //           index: 0,
  //           routes: [{ routeName: "SERVICES_HOME", key: "id-1604446084902-3" }],
  //           routeName: "SERVICES_NAVIGATOR"
  //         },
  //         {
  //           key: "PROFILE_NAVIGATOR",
  //           isTransitioning: false,
  //           index: 0,
  //           routes: [{ routeName: "PROFILE_MAIN", key: "id-1604446084902-4" }],
  //           routeName: "PROFILE_NAVIGATOR"
  //         }
  //       ],
  //       index: 1,
  //       isTransitioning: false,
  //       routeName: "MAIN",
  //       key: "id-1604446084902-5"
  //     }
  //   ]
  // },
  // deepLink: { deepLink: null, immediate: false },
  // wallet: {
  //   transactions: {
  //     transactions: { kind: "PotSome", value: {} },
  //     total: { kind: "PotSome", value: 0 }
  //   },
  //   wallets: {
  //     walletById: { kind: "PotSome", value: {} },
  //     favoriteWalletId: { kind: "PotNone" },
  //     creditCardAddWallet: { kind: "PotNone" },
  //     creditCardVerification: { kind: "PotNone" },
  //     creditCardCheckout3ds: { kind: "PotNone" }
  //   },
  //   payment: {
  //     verifica: { kind: "PotNone" },
  //     attiva: { kind: "PotNone" },
  //     paymentId: { kind: "PotNone" },
  //     check: { kind: "PotNone" },
  //     psps: { kind: "PotNone" },
  //     allPsps: { kind: "PotNone" },
  //     transaction: { kind: "PotNone" },
  //     confirmedTransaction: { kind: "PotNone" }
  //   },
  //   pspsById: {},
  //   abi: { kind: "undefined" },
  //   onboarding: {
  //     bancomat: {
  //       foundPans: { kind: "undefined" },
  //       addingPans: { addingResult: { kind: "undefined" } },
  //       addedPans: [],
  //       abiSelected: null
  //     }
  //   }
  // },
  // backendInfo: {
  //   serverInfo: {
  //     min_app_version: { ios: "0.0.0", android: "0.0.0" },
  //     min_app_version_pagopa: { ios: "0.0.0", android: "0.0.0" },
  //     version: "7.8.0"
  //   }
  // },
  // backendStatus: {
  //   status: {
  //     value: { is_alive: true, message: { "it-IT": "", "en-EN": "" } },
  //     _tag: "Some"
  //   },
  //   areSystemsDead: false,
  //   deadsCounter: 0
  // },
  // preferences: { languages: ["en", "it-US"] },
  // navigationHistory: [
  //   {
  //     key: "StackRouterRoot",
  //     isTransitioning: false,
  //     index: 0,
  //     routes: [
  //       {
  //         routes: [
  //           {
  //             key: "MESSAGES_NAVIGATOR",
  //             isTransitioning: false,
  //             index: 0,
  //             routes: [
  //               { routeName: "MESSAGES_HOME", key: "id-1604446084902-1" }
  //             ],
  //             routeName: "MESSAGES_NAVIGATOR"
  //           },
  //           {
  //             key: "WALLET_HOME",
  //             isTransitioning: false,
  //             index: 0,
  //             routes: [{ routeName: "WALLET_HOME", key: "id-1604446084902-2" }],
  //             routeName: "WALLET_HOME"
  //           },
  //           {
  //             key: "SERVICES_NAVIGATOR",
  //             isTransitioning: false,
  //             index: 0,
  //             routes: [
  //               { routeName: "SERVICES_HOME", key: "id-1604446084902-3" }
  //             ],
  //             routeName: "SERVICES_NAVIGATOR"
  //           },
  //           {
  //             key: "PROFILE_NAVIGATOR",
  //             isTransitioning: false,
  //             index: 0,
  //             routes: [
  //               { routeName: "PROFILE_MAIN", key: "id-1604446084902-4" }
  //             ],
  //             routeName: "PROFILE_NAVIGATOR"
  //           }
  //         ],
  //         index: 0,
  //         isTransitioning: false,
  //         routeName: "MAIN",
  //         key: "id-1604446084902-5"
  //       }
  //     ]
  //   },
  //   {
  //     key: "StackRouterRoot",
  //     isTransitioning: false,
  //     index: 0,
  //     routes: [
  //       {
  //         routes: [
  //           {
  //             key: "MESSAGES_NAVIGATOR",
  //             isTransitioning: false,
  //             index: 0,
  //             routes: [
  //               { routeName: "MESSAGES_HOME", key: "id-1604446084902-1" }
  //             ],
  //             routeName: "MESSAGES_NAVIGATOR"
  //           },
  //           {
  //             key: "WALLET_HOME",
  //             isTransitioning: false,
  //             index: 0,
  //             routes: [{ routeName: "WALLET_HOME", key: "id-1604446084902-2" }],
  //             routeName: "WALLET_HOME"
  //           },
  //           {
  //             key: "SERVICES_NAVIGATOR",
  //             isTransitioning: false,
  //             index: 0,
  //             routes: [
  //               { routeName: "SERVICES_HOME", key: "id-1604446084902-3" }
  //             ],
  //             routeName: "SERVICES_NAVIGATOR"
  //           },
  //           {
  //             key: "PROFILE_NAVIGATOR",
  //             isTransitioning: false,
  //             index: 0,
  //             routes: [
  //               { routeName: "PROFILE_MAIN", key: "id-1604446084902-4" }
  //             ],
  //             routeName: "PROFILE_NAVIGATOR"
  //           }
  //         ],
  //         index: 1,
  //         isTransitioning: false,
  //         routeName: "MAIN",
  //         key: "id-1604446084902-5"
  //       }
  //     ]
  //   },
  //   {
  //     key: "StackRouterRoot",
  //     isTransitioning: false,
  //     index: 0,
  //     routes: [
  //       {
  //         routes: [
  //           {
  //             key: "MESSAGES_NAVIGATOR",
  //             isTransitioning: false,
  //             index: 0,
  //             routes: [
  //               { routeName: "MESSAGES_HOME", key: "id-1604446084902-1" }
  //             ],
  //             routeName: "MESSAGES_NAVIGATOR"
  //           },
  //           {
  //             key: "WALLET_HOME",
  //             isTransitioning: false,
  //             index: 1,
  //             routes: [
  //               { routeName: "WALLET_HOME", key: "id-1604446084902-2" },
  //               {
  //                 params: {
  //                   inPayment: { _tag: "None" },
  //                   keyFrom: "id-1604446084902-2"
  //                 },
  //                 routeName: "WALLET_ADD_PAYMENT_METHOD",
  //                 key: "id-1604446084902-6"
  //               }
  //             ],
  //             routeName: "WALLET_HOME"
  //           },
  //           {
  //             key: "SERVICES_NAVIGATOR",
  //             isTransitioning: false,
  //             index: 0,
  //             routes: [
  //               { routeName: "SERVICES_HOME", key: "id-1604446084902-3" }
  //             ],
  //             routeName: "SERVICES_NAVIGATOR"
  //           },
  //           {
  //             key: "PROFILE_NAVIGATOR",
  //             isTransitioning: false,
  //             index: 0,
  //             routes: [
  //               { routeName: "PROFILE_MAIN", key: "id-1604446084902-4" }
  //             ],
  //             routeName: "PROFILE_NAVIGATOR"
  //           }
  //         ],
  //         index: 1,
  //         isTransitioning: false,
  //         routeName: "MAIN",
  //         key: "id-1604446084902-5"
  //       }
  //     ]
  //   }
  // ],
  instabug: { unreadMessages: 0 },
  search: {
    searchText: { _tag: "None" },
    isSearchEnabled: false,
    isSearchMessagesEnabled: false,
    isSearchServicesEnabled: false
  },
  // cie: {
  //   hasApiLevelSupport: { kind: "PotNone" },
  //   hasNFCFeature: { kind: "PotNone" },
  //   isCieSupported: { kind: "PotNone" },
  //   isNfcEnabled: { kind: "PotNone" },
  //   readingEvent: { kind: "PotNone" }
  // },
  // bonus: {
  //   availableBonusTypes: { kind: "PotNone" },
  //   bonusVacanze: {
  //     activation: { status: "UNDEFINED" },
  //     eligibility: {
  //       checkRequest: { status: "UNDEFINED", check: { kind: "PotNone" } }
  //     },
  //     allActive: {}
  //   },
  //   bpd: {
  //     details: {
  //       activation: {
  //         enabled: { kind: "undefined" },
  //         payoffInstr: {
  //           enrolledValue: { kind: "undefined" },
  //           upsert: { outcome: { kind: "undefined" } }
  //         }
  //       },
  //       paymentMethods: {},
  //       periods: { kind: "PotNone" },
  //       amounts: {},
  //       transactions: {}
  //     },
  //     onboarding: { enrollment: { kind: "undefined" }, ongoing: false }
  //   }
  // },
  // internalRouteNavigation: null,
  // authentication: {
  //   kind: "LoggedInWithSessionInfo",
  //   reason: "NOT_LOGGED_IN",
  //   idp: {
  //     id: "posteid",
  //     name: "Poste",
  //     logo: 8,
  //     entityID: "posteid",
  //     profileUrl: "https://posteid.poste.it/private/cruscotto.shtml"
  //   },
  //   sessionToken:
  //     "2415b190291504710c02ad0e500b6a369f69d8d78af51591f14bb7d03d60911e466213e159b9ee7d69cd5c64437d2adc",
  //   sessionInfo: {
  //     bpdToken:
  //       "f6850416477432ecbde1f94dfe59f2d6350f716cb2cf523d8cad36fa18d71fa9924e0ea6d372ecab86447abe93d99cd5",
  //     myPortalToken:
  //       "e23e064f75e3fd5c2979c27b9fb3561bcb453ae952c83f0e1bb6075666cfef2aee7169667f187efe65e41789af643249",
  //     spidLevel: "https://www.spid.gov.it/SpidL2",
  //     walletToken:
  //       "787352635248824960766f96115b59ac1c2ca700c7e68192e4a7c26e1e17ca4fcc2a66e158295390624f87f05f53235e"
  //   },
  //   _persist: { version: -1, rehydrated: true }
  // },
  // identification: {
  //   progress: { kind: "identified" },
  //   _persist: { version: -1, rehydrated: true }
  // },
  // onboarding: { isFingerprintAcknowledged: true },
  // notifications: {
  //   installation: { id: "001bfda2688225c49a8943720c08a841e2a" },
  //   pendingMessage: null
  // },
  // profile: {
  //   kind: "PotSome",
  //   value: {
  //     accepted_tos_version: 2.1,
  //     email: "g.mancini.0@gmail.com",
  //     family_name: "Mancini",
  //     fiscal_code: "MNCGNN81M28E335F",
  //     has_profile: true,
  //     is_email_enabled: true,
  //     is_email_validated: true,
  //     is_inbox_enabled: true,
  //     is_webhook_enabled: true,
  //     name: "Giovanni",
  //     preferred_languages: ["it_IT"],
  //     spid_email: "g.mancini.0@gmail.com",
  //     spid_mobile_phone: "+393396452819",
  //     version: 4
  //   }
  // },
  // userDataProcessing: {
  //   DOWNLOAD: { kind: "PotNone" },
  //   DELETE: { kind: "PotNone" }
  // },
  // userMetadata: {
  //   kind: "PotSome",
  //   value: {
  //     version: 1,
  //     metadata: { organizationsOfInterest: ["02438750586"] }
  //   }
  // },
  // entities: {
  //   messages: {
  //     byId: {
  //       "01EM0YYNB5AHF8TSQ3GGQ3JX8X": {
  //         meta: {
  //           created_at: "2020-10-07T07:21:03.589Z",
  //           fiscal_code: "MNCGNN81M28E335F",
  //           id: "01EM0YYNB5AHF8TSQ3GGQ3JX8X",
  //           sender_service_id: "01DBJNYDCT0Q5G0D0K7RFS2R2F",
  //           time_to_live: 3600
  //         },
  //         message: {
  //           kind: "PotSome",
  //           value: {
  //             content: {
  //               subject: "Riepilogo Certificati/Attestati di Proprieta'",
  //               markdown:
  //                 "Ecco i Certificati/Attestati di proprietà disponibili per i tuoi veicoli:\n\nVeicolo: AUTOVEICOLO  \nTarga: DP044FE  \nIntestato a: GIOVANNI MANCINI  \nCertificato di Proprietà cartaceo non consultabile online\n\n\n\nPuoi visualizzare maggiori dettagli sul sito dell'[Automobile Club d'Italia](http://www.aci.it) alla pagina del servizio [Certificato di Proprietà Digitale](http://www.aci.it/i-servizi/servizi-online/certificato-di-proprieta-digitale.html)  \n\nSe qualcosa non ti è chiaro puoi formulare il quesito accedendo al [Contact Center URP](http://www.aci.it/laci/urp/urp-ufficio-relazioni-con-il-pubblico.html?no_cache=1) e compilando l'apposito form, oppure contattando il Call Center URP, tramite il numero verde 800.18.34.34, operativo dal lunedì al venerdì dalle ore 8.30 alle ore 13,00, festivi esclusi. \n"
  //             },
  //             created_at: "2020-10-07T07:21:03.589Z",
  //             fiscal_code: "MNCGNN81M28E335F",
  //             id: "01EM0YYNB5AHF8TSQ3GGQ3JX8X",
  //             sender_service_id: "01DBJNYDCT0Q5G0D0K7RFS2R2F",
  //             time_to_live: 3600
  //           }
  //         }
  //       },
  //       "01EM0V28GJVP2K0GGAF92V26BE": {
  //         meta: {
  //           created_at: "2020-10-07T06:13:07.218Z",
  //           fiscal_code: "MNCGNN81M28E335F",
  //           id: "01EM0V28GJVP2K0GGAF92V26BE",
  //           sender_service_id: "01DBJNFSJYB53TP0AZNA8FQGJJ",
  //           time_to_live: 3600
  //         },
  //         message: {
  //           kind: "PotSome",
  //           value: {
  //             content: {
  //               subject: "Benvenuto su IO",
  //               markdown:
  //                 "Alcuni servizi dell'Automobile Club d'Italia (ACI) sono adesso disponibili su IO.\n\nIn particolare potrai:\n\n- ricevere certificati di proprieta' digitali per i nuovi veicoli;\n- visualizzare un riepilogo dei certificati di proprieta' a te intestati;\n- ricevere promemoria per il pagamento del bollo della tua auto, e procedere al pagamento.\n\nPer altre informazioni o per contattare l'ACI puoi accedere alla [scheda servizio](http://www.aci.it/)."
  //             },
  //             created_at: "2020-10-07T06:13:07.218Z",
  //             fiscal_code: "MNCGNN81M28E335F",
  //             id: "01EM0V28GJVP2K0GGAF92V26BE",
  //             sender_service_id: "01DBJNFSJYB53TP0AZNA8FQGJJ",
  //             time_to_live: 3600
  //           }
  //         }
  //       },
  //       "01EKYHPAV7BN99CYYXJ2F3Y2RX": {
  //         meta: {
  //           created_at: "2020-10-06T08:50:50.343Z",
  //           fiscal_code: "MNCGNN81M28E335F",
  //           id: "01EKYHPAV7BN99CYYXJ2F3Y2RX",
  //           sender_service_id: "azure-deployc49a",
  //           time_to_live: 3600
  //         },
  //         message: {
  //           kind: "PotSome",
  //           value: {
  //             content: {
  //               markdown:
  //                 '## Scopri quali enti e servizi puoi trovare all’interno di IO.\n\nL’app IO nasce per offrirti un unico punto di accesso, comodo, semplice e sicuro, verso tutti i servizi della Pubblica Amministrazione. Diversi enti nazionali e locali hanno già portato i loro servizi a bordo e molti se ne aggiungeranno in futuro. Siamo infatti solo all’inizio del percorso che, progressivamente, porterà i cittadini italiani ad avere nuovi servizi digitali messi a disposizione da tutti gli enti pubblici all’interno dell’app.\n\nNella sezione [servizi](ioit://SERVICES_HOME) puoi indicare le aree geografiche di tuo interesse (dove vivi, dove lavori, o dove magari vai spesso) per essere sempre informato sui nuovi servizi in arrivo in quel Comune o in quella Regione.\n\nSe non vedi gli enti del tuo territorio tra quelli elencati, è perché i loro servizi sono ancora in corso di integrazione. Se vuoi saperne di più, chiedi al tuo Comune se hanno attivato il processo per essere presenti su IO e a che punto sono. La tua voce può essere un segnale importante!\n\nTutti i servizi all’interno dell’app sono attivi: questo non vuol dire che ti contatteranno, anzi. Ti scriveranno solo i servizi che hanno qualcosa da dire proprio a te, in caso di comunicazioni rilevanti come ad esempio la scadenza di un documento, il promemoria per un pagamento o l’aggiornamento su una pratica in corso.\nSe, per un determinato servizio, preferisci utilizzare mezzi di comunicazione diversi dall’app IO, puoi in ogni momento disattivarlo: in quel caso, l’Ente continuerà a contattarti avvalendosi dei canali tradizionali (come ad esempio la posta cartacea).\nIn particolare:\n- nella sezione [Servizi](ioit://SERVICES_HOME) ti viene data la possibilità di disattivare tutti i servizi, disattivare tutti i servizi per un singolo Ente, oppure disattivare singoli servizi. Inoltre cliccando su ciascun servizio e entrando nella relativa scheda, potrai disattivare le notifiche via email e/o push (che possono essere disabilitate anche tramite la funzionalità del tuo dispositivo);\n- nella Sezione [Preferenze](ioit://PROFILE_PREFERENCES_HOME) troverai la funzione "Inoltro dei messaggi via email" dove potrai abilitare/disabilitare tale modalità di notifica per tutti o singoli servizi.\n\nInfine, è importante sapere che per ora i messaggi inviati dagli enti tramite IO non hanno valore legale.\n\nPer approfondimenti ti invitiamo a consultare la sezione [servizi](ioit://SERVICES_HOME) di questa applicazione; per maggiori informazioni sull’avanzamento del progetto, visita il sito [io.italia.it](https://io.italia.it).\n',
  //               subject: "Quali servizi trovi su IO?"
  //             },
  //             created_at: "2020-10-06T08:50:50.343Z",
  //             fiscal_code: "MNCGNN81M28E335F",
  //             id: "01EKYHPAV7BN99CYYXJ2F3Y2RX",
  //             sender_service_id: "azure-deployc49a",
  //             time_to_live: 3600
  //           }
  //         }
  //       },
  //       "01EKYHPAQB048NK21X4NWBHS6W": {
  //         meta: {
  //           created_at: "2020-10-06T08:50:50.219Z",
  //           fiscal_code: "MNCGNN81M28E335F",
  //           id: "01EKYHPAQB048NK21X4NWBHS6W",
  //           sender_service_id: "azure-deployc49a",
  //           time_to_live: 3600
  //         },
  //         message: {
  //           kind: "PotSome",
  //           value: {
  //             content: {
  //               markdown:
  //                 "## Benvenuto nella prima versione pubblica di IO!\n\nCiao! Questa è la prima versione di IO, l’app dei servizi pubblici, aperta a tutti i cittadini. Cosa vuol dire? Significa che, come te, chiunque lo desideri potrà installare e iniziare a usare l’app, sapendo che evolverà e migliorerà continuamente anche grazie all’esperienza diretta e ai feedback delle persone a cui è destinata.\n\nRendendo IO disponibile per tutti, consentiamo agli enti pubblici di portare progressivamente i propri servizi sull’app e ai cittadini italiani di avere dei servizi pubblici nuovi, moderni e centrati sulle proprie esigenze.\n\n### Scopri le funzioni di IO\n\nEcco come potrai usare IO attraverso le diverse funzioni disponibili oggi nell’app: molte altre ne arriveranno nei prossimi mesi!  \nIO ti permetterà di richiedere e spendere il “[Bonus Vacanze](https://io.italia.it/bonus-vacanze/)”, che troverai nella sezione “Pagamenti” dell’app a partire dal 1° Luglio. IO ti avviserà con un aggiornamento quando il nuovo servizio sarà disponibile.\n\n#### I messaggi\n\nIO ti consente di ricevere comunicazioni da tutte le Pubbliche Amministrazioni italiane, locali e nazionali, di tenere sotto controllo ogni scadenza e, all’occorrenza, effettuare dei pagamenti.\nAll’arrivo di ogni nuovo messaggio, IO ti informa attraverso una notifica e un inoltro del messaggio sulla tua casella di posta: nella sezione [servizi](ioit://SERVICES_HOME) puoi decidere come essere contattato da ciascun servizio.\n\n#### I pagamenti\n\nIO integra [pagoPA](https://www.pagopa.gov.it/) per effettuare pagamenti sicuri verso la Pubblica Amministrazione. Se hai già usato pagoPA come utente registrato, nella sezione [Pagamenti](ioit://WALLET_HOME) potrai vedere lo storico delle transazioni effettuate e le tue carte di credito salvate. Puoi usare la sezione [Pagamenti](ioit://WALLET_HOME) per aggiungere i tuoi metodi di pagamento preferiti, procedere al pagamento di un avviso pagoPA (tramite scansione del codice QR o inserimento manuale del codice IUV) e tenere traccia di tutte le operazioni svolte.  \nNella sezione [Pagamenti](ioit://WALLET_HOME) troverai la possibilità di richiedere il Bonus Vacanze, disponibile a partire dal 1° Luglio.\n\n#### I servizi\n\nAl momento del tuo primo accesso in IO, tutti i Servizi disponibili sono attivi. Nella sezione [servizi](ioit://SERVICES_HOME) puoi vedere quali sono i servizi locali e nazionali disponibili all’interno dell’app e decidere da quali essere contattato e come. Aggiungi le tue aree geografiche di interesse per essere sempre informato sui nuovi servizi in arrivo nel tuo Comune o nella tua Regione.\n\n#### Serve aiuto ?\n\nSe qualcosa non ti è chiaro durante l’utilizzo dell’app, usa il punto di domanda in alto a destra per leggere approfondimenti e indicazioni utili relative alla sezione in cui ti trovi.\nRicorda che i messaggi che IO ti recapita sono inviati direttamente dagli enti pubblici: se i tuoi dubbi riguardano il contenuto di un messaggio, contatta direttamente l’ente che ti ha scritto con gli appositi pulsanti che trovi nel corpo del messaggio o nella scheda del servizio.\nSe hai un problema e non trovi risposte utili nella pagina di aiuto, contatta il team di IO utilizzando il pulsante con la coccinella (se ti sembra si tratti di un malfunzionamento) o l’icona della chat (per interagire direttamente con la nostra assistenza, in caso di problemi urgenti).\n\n#### Come partecipare al progetto\n\nIO è un progetto che cresce e migliora giorno dopo giorno grazie al contributo degli utenti. Per questo ti chiediamo, se vorrai, di segnalarci ogni aspetto dal tuo punto di vista migliorabile, utilizzando l'apposita funzione con l’icona a coccinella (per segnalare errori di funzionamento) o la chat (per inviare suggerimenti o commentare la tua esperienza).\n\nIO è un progetto 100% open source. Se sei un designer o uno sviluppatore, puoi contribuire direttamente al design e sviluppo dell’applicazione: visita il sito [io.italia.it](https://io.italia.it) per trovare più informazioni su come dare il tuo contributo.\n\nGrazie di far parte del progetto IO!\n",
  //               subject: "Benvenuto su IO"
  //             },
  //             created_at: "2020-10-06T08:50:50.219Z",
  //             fiscal_code: "MNCGNN81M28E335F",
  //             id: "01EKYHPAQB048NK21X4NWBHS6W",
  //             sender_service_id: "azure-deployc49a",
  //             time_to_live: 3600
  //           }
  //         }
  //       }
  //     },
  //     allIds: {
  //       kind: "PotSome",
  //       value: [
  //         "01EKYHPAQB048NK21X4NWBHS6W",
  //         "01EKYHPAV7BN99CYYXJ2F3Y2RX",
  //         "01EM0V28GJVP2K0GGAF92V26BE",
  //         "01EM0YYNB5AHF8TSQ3GGQ3JX8X"
  //       ]
  //     },
  //     idsByServiceId: {
  //       "01DBJNFSJYB53TP0AZNA8FQGJJ": ["01EM0V28GJVP2K0GGAF92V26BE"],
  //       "01DBJNYDCT0Q5G0D0K7RFS2R2F": ["01EM0YYNB5AHF8TSQ3GGQ3JX8X"],
  //       "azure-deployc49a": [
  //         "01EKYHPAV7BN99CYYXJ2F3Y2RX",
  //         "01EKYHPAQB048NK21X4NWBHS6W"
  //       ]
  //     }
  //   },
  //   messagesStatus: {
  //     "01EKYHPAV7BN99CYYXJ2F3Y2RX": { isRead: false, isArchived: false },
  //     "01EM0V28GJVP2K0GGAF92V26BE": { isRead: false, isArchived: false },
  //     "01EKYHPAQB048NK21X4NWBHS6W": { isRead: false, isArchived: false },
  //     "01EM0YYNB5AHF8TSQ3GGQ3JX8X": { isRead: false, isArchived: false }
  //   },
  //   services: {
  //     byId: {
  //       "01D4AQHBKESFSX98TK52PMD5S3": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "Servizi E-Government",
  //           organization_fiscal_code: "00514490010",
  //           organization_name: "Città di Torino",
  //           service_id: "01D4AQHBKESFSX98TK52PMD5S3",
  //           service_metadata: {
  //             description:
  //               "SportelloFacile è un servizio on-line che consente a tutti i cittadini di effettuare delle prenotazioni di appuntamento presso diversi sportelli della Città di Torino.\nTramite IO potrai:\n\n  * ricevere un promemoria che ti ricorda data e orario di un appuntamento prenotato presso un ufficio comunale;\n  * essere notificato in caso di modifica o disdetta dell'appuntamento.\n",
  //             email: "info@torinofacile.it",
  //             phone: "800 450 900",
  //             privacy_url:
  //               "http://www.comune.torino.it/condizioni.shtml#privacy",
  //             scope: "LOCAL",
  //             tos_url: "http://www.comune.torino.it/condizioni.shtml",
  //             web_url:
  //               "https://servizi.torinofacile.it/cgi-bin/accesso/base/index.cgi?cod_servizio=SPOT"
  //           },
  //           service_name: "Sportello Facile",
  //           version: 13
  //         }
  //       },
  //       "01D4AQHCWWH2366GDBHV6MXDVT": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "Servizi Educativi",
  //           organization_fiscal_code: "00514490010",
  //           organization_name: "Città di Torino",
  //           service_id: "01D4AQHCWWH2366GDBHV6MXDVT",
  //           service_metadata: {
  //             address: "via Bazzi 4, 10152 Torino",
  //             description:
  //               "Il servizio di Iscrizione ai Nidi d'infanzia del Comune di Torino.\nTramite IO potrai:\n\n  * Essere avvisato dell'ammissione di tuo figlio/a all'asilo nido ai fini della conferma del posto.\n",
  //             email: "iscrizionenidi@comune.torino.it",
  //             privacy_url:
  //               "http://www.comune.torino.it/condizioni.shtml#privacy",
  //             scope: "LOCAL",
  //             tos_url: "http://www.comune.torino.it/condizioni.shtml",
  //             web_url:
  //               "https://servizi.torinofacile.it/info/servizi/iscrizione-nidi-dinfanzia-e-sezioni-primavera"
  //           },
  //           service_name: "Iscrizione nidi d'infanzia",
  //           version: 10
  //         }
  //       },
  //       "01D4AQHE0R5DRJJ9635WSK7GZE": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "Risorse Finanziarie",
  //           organization_fiscal_code: "00514490010",
  //           organization_name: "Città di Torino",
  //           service_id: "01D4AQHE0R5DRJJ9635WSK7GZE",
  //           service_metadata: {
  //             address: "Corso Racconigi 49, 10139 Torino",
  //             description:
  //               "Tramite IO potrai:\n\n  * Ricevere un promemoria alla scadenza del pagamento della TARI.\n",
  //             email: "tassarifiuti@comune.torino.it",
  //             phone: "011 01124853",
  //             privacy_url:
  //               "http://www.comune.torino.it/condizioni.shtml#privacy",
  //             scope: "LOCAL",
  //             tos_url: "http://www.comune.torino.it/condizioni.shtml",
  //             web_url: "http://www.comune.torino.it/tasse/iuc/tari/"
  //           },
  //           service_name: "Avviso scadenza TARI",
  //           version: 10
  //         }
  //       },
  //       "01D5ECFA96C6HYNPXVC6P55D1S": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "Mobilità, ambiente e energia",
  //           organization_fiscal_code: "01199250158",
  //           organization_name: "Comune di Milano",
  //           service_id: "01D5ECFA96C6HYNPXVC6P55D1S",
  //           service_metadata: {
  //             description:
  //               "Servizio Area B del Comune di Milano.\nTramite IO potrai:\n\n* Ricevere una notifica al primo passaggio di un veicolo non autorizzato in area B\n",
  //             pec: "mtaareab@postacert.comune.milano.it",
  //             phone: "+39 020202",
  //             privacy_url: "https://www.comune.milano.it/policy/privacy",
  //             scope: "LOCAL",
  //             web_url:
  //               "https://www.comune.milano.it/aree-tematiche/mobilita/area-b"
  //           },
  //           service_name: "Area B",
  //           version: 42
  //         }
  //       },
  //       "01D5RQM2NVWM2QVZPQQ4FC8Z2E": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "Servizi civici, partecipazione e sport",
  //           organization_fiscal_code: "01199250158",
  //           organization_name: "Comune di Milano",
  //           service_id: "01D5RQM2NVWM2QVZPQQ4FC8Z2E",
  //           service_metadata: {
  //             description:
  //               "Lo sportello dei Servizi al Cittadino si occupa di certificati, carte d'identità e certificazioni.\nTramite IO potrai:\n\n* Ricevere un promemoria in prossimità della scadenza della tua carta d'identità.\n",
  //             pec: "servizialcittadino@postacert.comune.milano.it",
  //             phone: "+39 020202",
  //             privacy_url: "https://www.comune.milano.it/policy/privacy",
  //             scope: "LOCAL",
  //             web_url: "https://www.comune.milano.it/fascicolo-del-cittadino"
  //           },
  //           service_name: "Servizi al cittadino",
  //           version: 12
  //         }
  //       },
  //       "01D72312AZT81N4JC3GV6980CK": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "Bilancio e entrate",
  //           organization_fiscal_code: "01199250158",
  //           organization_name: "Comune di Milano",
  //           service_id: "01D72312AZT81N4JC3GV6980CK",
  //           service_metadata: {
  //             description:
  //               "Il servizio dei Tributi Locali del Comune di Milano gestisce il tributo sui rifiuti (TARI/TARES/TARSU).\nTramite IO potrai:\n\n* Ricevere un avviso di pagamento per le rate TARI, e procedere al pagamento.\n",
  //             pec: "tassarifiuti@pec.comune.milano.it",
  //             phone: "+39 02 02 02",
  //             privacy_url: "https://www.comune.milano.it/policy/privacy",
  //             scope: "LOCAL",
  //             web_url:
  //               "https://web.comune.milano.it/wps/myportal/myMilano/app/fascicolocittadino/imieipagamenti"
  //           },
  //           service_name: "Tributi locali",
  //           version: 10
  //         }
  //       },
  //       "01D81BTR75QGVVCC2ASSSZNSNV": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "Patrimonio, Partecipate e Appalti",
  //           organization_fiscal_code: "09000640012",
  //           organization_name: "Città di Torino",
  //           service_id: "01D81BTR75QGVVCC2ASSSZNSNV",
  //           service_metadata: {
  //             address: "Piazza Palazzo di Città 7, 10122 Torino",
  //             description:
  //               "Tramite IO potrai:\n\n  * Ricevere l'avviso per il pagamento del canone di affitto e locazione di immobili comunali.\n",
  //             privacy_url:
  //               "http://www.soris.torino.it/cms/risorse/phocadownload/Chi_Siamo/Informativa_Privacy/privacy.pdf",
  //             scope: "LOCAL"
  //           },
  //           service_name: "Canoni di affitto e locazione",
  //           version: 12
  //         }
  //       },
  //       "01D88CM09S0SB72B7AN92XGKPC": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "Servizi demografici",
  //           organization_fiscal_code: "80010170266",
  //           organization_name: "Comune di Preganziol",
  //           service_id: "01D88CM09S0SB72B7AN92XGKPC",
  //           service_metadata: {
  //             address: "Piazza Gabbin, 1 - Preganziol",
  //             description:
  //               "Il servizio di Scadenza e Rinnovo Documenti offre la possibilità di conoscere lo stato dei tuoi documenti. \nTramite IO potrai:\n\n* ricevere un promemoria in prossimità della scadenza della tua carta d'identità;\n* ricevere un avviso che ti ricorda che il permesso di soggiorno risulta scaduto da almeno 6 mesi e che devi esibire il nuovo permesso in anagrafe.\n",
  //             email: "anagrafe@comune.preganziol.tv.it",
  //             pec: "protocollo.comune.preganziol.tv@pecveneto.it",
  //             phone: "0422 632298",
  //             scope: "LOCAL"
  //           },
  //           service_name: "Scadenza e Rinnovo Documenti",
  //           version: 12
  //         }
  //       },
  //       "01D9VYPJ9S41QCD3E6XE3K6D1N": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "Risorse Finanziarie",
  //           organization_fiscal_code: "00514490010",
  //           organization_name: "Città di Torino",
  //           service_id: "01D9VYPJ9S41QCD3E6XE3K6D1N",
  //           service_metadata: {
  //             address: "Corso Racconigi 49, 10139 Torino",
  //             description:
  //               "Tramite IO potrai:\n\n  * Ricevere un promemoria alla scadenza del pagamento di IMU e TASI.\n",
  //             email: "assistenzaimu@comune.torino.it",
  //             phone: "011 01124857",
  //             privacy_url:
  //               "http://www.comune.torino.it/condizioni.shtml#privacy",
  //             scope: "LOCAL",
  //             tos_url: "http://www.comune.torino.it/condizioni.shtml",
  //             web_url: "http://www.comune.torino.it/tasse/iuc/imu/index.shtml"
  //           },
  //           service_name: "Avviso scadenza IMU e TASI",
  //           version: 11
  //         }
  //       },
  //       "01DBAW7AY7RP4E3EMST2X21K3W": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "Comando di Polizia Municipale",
  //           organization_fiscal_code: "03334231200",
  //           organization_name: "Comune Valsamoggia",
  //           service_id: "01DBAW7AY7RP4E3EMST2X21K3W",
  //           service_metadata: {
  //             address:
  //               "Piazza Libertà 14 (loc. Monteveglio) - 40053 Valsamoggia (BO)",
  //             description:
  //               "Il Comando di Polizia Municipale del Comune di Valsamoggia si occupa delle sanzioni al codice della strada e della riscossione dell'importo dovuto.\nTramite IO potrai:\n\n  * ricevere eventuali avvisi di contravvenzione al codice della strada, e pagare le sanzioni previste;\n  * ricevere avvisi di pre-ruolo per contravvenzioni al codice della strada non pagate, e procedere al pagamento.\n",
  //             email: "poliziamunicipale@comune.valsamoggia.bo.it",
  //             phone: "800 261 616",
  //             privacy_url:
  //               "https://www.comune.valsamoggia.bo.it/index.php/component/content/article/94-amministrazione-trasparente/2660-privacy-e-note-legali?Itemid=101",
  //             scope: "LOCAL",
  //             web_url:
  //               "https://www.comune.valsamoggia.bo.it/index.php/verbali-codice-strada-e-altre-violazioni"
  //           },
  //           service_name: "Sanzioni al codice della strada",
  //           version: 5
  //         }
  //       },
  //       "01DBCRDSXAT2CP73KVFHFSXD0P": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "Servizi alla Persona",
  //           organization_fiscal_code: "03334231200",
  //           organization_name: "Comune di Valsamoggia",
  //           service_id: "01DBCRDSXAT2CP73KVFHFSXD0P",
  //           service_metadata: {
  //             address:
  //               "Piazza Berozzi 3 (loc. Crespellano) - 40053 Valsamoggia (BO)",
  //             description:
  //               "Il servizio di Avvisi per Servizi scolastici fornisce informazioni legate alle attività scolastiche.\nTramite IO potrai:\n\n  * ricevere avvisi e informazioni sui bandi per l'iscrizione ai servizi scolastici.\n",
  //             email: "inforette@comune.valsamoggia.bo.it",
  //             phone: "051 6723027",
  //             privacy_url:
  //               "https://www.comune.valsamoggia.bo.it/index.php/component/content/article/94-amministrazione-trasparente/2660-privacy-e-note-legali?Itemid=101",
  //             scope: "LOCAL",
  //             web_url:
  //               "https://www.comune.valsamoggia.bo.it/index.php/servizi-online-valsamoggia/98-aree-tematiche/scuola-e-giovani/servizi-scolastici/4147-pagamenti-nido-d-infanzia-trasporto-prolungamento-orario"
  //           },
  //           service_name: "Avvisi per servizi scolastici",
  //           version: 7
  //         }
  //       },
  //       "01DBCRF8455F7NE9QE8TPEJVRV": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "Area Economica",
  //           organization_fiscal_code: "03334231200",
  //           organization_name: "Comune di Valsamoggia",
  //           service_id: "01DBCRF8455F7NE9QE8TPEJVRV",
  //           service_metadata: {
  //             address:
  //               "Piazza Berozzi 3 (loc. Crespellano) - 40053 Valsamoggia (BO)",
  //             description:
  //               "Il Servizio Entrate del Comune di Valsamoggia si occupa della riscossione dell'Imposta Unica Comunale - IUC (IMU, TARI e TASI).\nTramite IO potrai:\n\n  * ricevere un promemoria che ti avvisa della scadenza di pagamento della TARI;\n  * ricevere l'avviso di accertamento per il mancato pagamento di rate scadute, e pagare il relativo importo.\n",
  //             email: "tributi@comune.valsamoggia.bo.it",
  //             phone: "051 6723015",
  //             privacy_url:
  //               "https://www.comune.valsamoggia.bo.it/index.php/component/content/article/94-amministrazione-trasparente/2660-privacy-e-note-legali?Itemid=101",
  //             scope: "LOCAL",
  //             web_url:
  //               "https://www.comune.valsamoggia.bo.it/index.php/iuc-imu-tari-tasi"
  //           },
  //           service_name: "Servizio tributi",
  //           version: 7
  //         }
  //       },
  //       "01DBJNFSJYB53TP0AZNA8FQGJJ": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "ACI Informatica",
  //           organization_fiscal_code: "00907501001",
  //           organization_name: "ACI",
  //           service_id: "01DBJNFSJYB53TP0AZNA8FQGJJ",
  //           service_metadata: {
  //             description:
  //               "L'Automobile Club Italia partecipa alla open-beta di IO.\nTramite IO potrai:\n\n* ricevere messaggi informativi a carattere istituzionale che ti accompagnano nel corso della beta;\n* essere sempre aggiornato in caso di integrazione di nuovi servizi.\n",
  //             privacy_url:
  //               "http://www.aci.it/per-la-navigazione-del-sito/privacy-policy.html",
  //             scope: "NATIONAL"
  //           },
  //           service_name: "Comunicazione Istituzionale",
  //           version: 19
  //         }
  //       },
  //       "01DBJNW5NR2M2VQTM7VG0SGNNZ": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "Gestione Tasse Automobilistiche",
  //           organization_fiscal_code: "00493410583",
  //           organization_name: "ACI",
  //           service_id: "01DBJNW5NR2M2VQTM7VG0SGNNZ",
  //           service_metadata: {
  //             address: "ACI - Sede Legale - Via Marsala 8, 00185 Roma",
  //             description:
  //               "I servizi relativi al Bollo Auto offerti dall'ACI permettono di calcolare e pagare le proprie tasse automobilistiche.\nTramite IO potrai:\n\n* ricevere un promemoria in prossimità della scadenza del pagamento del Bollo Auto (se ti sei registrato nell'app almeno un mese prima della scadenza del pagamento);\n* pagare il Bollo Auto e ricevere una conferma del pagamento avvenuto.\n",
  //             privacy_url:
  //               "http://www.aci.it/per-la-navigazione-del-sito/privacy-policy.html",
  //             scope: "NATIONAL",
  //             web_url: "https://bollo.aci.it/#/main/home"
  //           },
  //           service_name: "Bollo Auto",
  //           version: 5
  //         }
  //       },
  //       "01DBJNYDCT0Q5G0D0K7RFS2R2F": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "Gestione PRA",
  //           organization_fiscal_code: "00907501001",
  //           organization_name: "ACI",
  //           service_id: "01DBJNYDCT0Q5G0D0K7RFS2R2F",
  //           service_metadata: {
  //             address: "ACI - Sede Legale - Via Marsala 8, 00185 Roma",
  //             description:
  //               "Il servizio di gestione PRA dell'ACI si occupa della gestione del Pubblico Registro Automobilistico.\nTramite IO potrai:\n\n* ricevere un riepilogo dei veicoli, e dei relativi certificati/attestazioni di proprietà,  di cui risulti intestatario al PRA aggiornato alla data di invio del messaggio;\n* ricevere, se acquisisci un nuovo veicolo,  la notifica con il suo certificato/attestazione di proprietà digitale.\n",
  //             phone: "800 18 34 34",
  //             privacy_url:
  //               "http://www.aci.it/per-la-navigazione-del-sito/privacy-policy.html",
  //             scope: "NATIONAL",
  //             web_url: "https://iservizi.aci.it/consultacdpd/"
  //           },
  //           service_name: "Certificati e Attestazioni di Proprietà",
  //           version: 6
  //         }
  //       },
  //       "01DCER0ANWQF5908X5YX3NKJD0": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "Servizi Finanziari",
  //           organization_fiscal_code: "00301970190",
  //           organization_name: "Comune di Ripalta Cremasca",
  //           service_id: "01DCER0ANWQF5908X5YX3NKJD0",
  //           service_metadata: {
  //             address: "via Roma 5, 26010 Ripalta Cremasca",
  //             description:
  //               "Il servizio CIE include l'emissione della carta di identità elettronica per scadenza naturale della carta di identità precedente o per smarrimento o furto della carta di identità.\nTramite IO potrai:\n\n  * procedere al pagamento della nuova CIE (carta di identità elettronica).\n",
  //             pec: "comune.ripaltacremasca@pec.it",
  //             phone: "0373 68131",
  //             privacy_url:
  //               "https://io.italia.it/ente/comune-di-ripalta-cremasca",
  //             scope: "LOCAL"
  //           },
  //           service_name: "CIE",
  //           version: 5
  //         }
  //       },
  //       "01DCER0VWBJVY6K6YXK1XM54C9": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "Servizi Finanziari",
  //           organization_fiscal_code: "00301970190",
  //           organization_name: "Comune di Ripalta Cremasca",
  //           service_id: "01DCER0VWBJVY6K6YXK1XM54C9",
  //           service_metadata: {
  //             address: "via Roma 5, 26010 Ripalta Cremasca",
  //             description:
  //               "I servizi scolastici di Ripalta Cremasca includono asilo nido, refezione scolastica, trasporto scolastico, pre e post-scuola, centri estivi, integrazione scolastica, fornitura libri di testo e contributi per libri di testo e borse di studio.\nTramite IO potrai:\n\n  * procedere al pagamento della mensa scolastica.\n",
  //             pec: "comune.ripaltacremasca@pec.it",
  //             phone: "0373 68131",
  //             privacy_url:
  //               "https://io.italia.it/ente/comune-di-ripalta-cremasca",
  //             scope: "LOCAL",
  //             web_url: "https://ripaltacremasca.ecivis.it/ECivisWEB/"
  //           },
  //           service_name: "Mensa Scolastica",
  //           version: 6
  //         }
  //       },
  //       "01DCER17X2DG6DBD7ZMN1Z95H7": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "Servizi Finanziari",
  //           organization_fiscal_code: "00301970190",
  //           organization_name: "Comune di Ripalta Cremasca",
  //           service_id: "01DCER17X2DG6DBD7ZMN1Z95H7",
  //           service_metadata: {
  //             address: "via Roma 5, 26010 Ripalta Cremasca",
  //             description:
  //               "ll Comune di Ripalta Cremasca aderisce al Sistema PagoPA per il pagamento TARI.\nTramite IO potrai:\n\n  * effettuare il pagamento della TARI 2019 in rata unica;\n  * effettuare il pagamento della TARI 2019 in rate separate;\n  * ricevere un riepilogo dei tuoi immobili soggetti al calcolo della TARI.\n",
  //             email: "tributi@comune.ripaltacremsca.cr.it",
  //             pec: "comune.ripaltacremasca@pec.it",
  //             phone: "0373 68131",
  //             privacy_url:
  //               "https://io.italia.it/ente/comune-di-ripalta-cremasca",
  //             scope: "LOCAL",
  //             web_url:
  //               "https://www.comune.ripaltacremasca.cr.it/servizi/pago-pa"
  //           },
  //           service_name: "TARI",
  //           version: 6
  //         }
  //       },
  //       "01DEYQGXBN1XB9W6RDZV94V20A": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "Servizi Finanziari",
  //           organization_fiscal_code: "00301970190",
  //           organization_name: "Comune di Ripalta Cremasca",
  //           service_id: "01DEYQGXBN1XB9W6RDZV94V20A",
  //           service_metadata: {
  //             address: "Via Roma, 5",
  //             description:
  //               "Il Minigrest è un servizio comunale (nato in collaborazione con la parrocchia) che cerca di soddisfare le necessità dei genitori che lavorano, e che necessitano di un luogo tranquillo e sicuro dove lasciare i propri figli nel periodo estivo.\nTramite IO potrai:\n\n  * procedere al pagamento del servizio mensa.\n",
  //             email: "comune.ripaltacremasca@pec.it",
  //             phone: "0373 68131",
  //             privacy_url: "https://www.comune.ripaltacremasca.cr.it/privacy",
  //             scope: "LOCAL",
  //             web_url: "https://ripaltacremasca.ecivis.it/ECivisWEB/"
  //           },
  //           service_name: "Minigrest",
  //           version: 39
  //         }
  //       },
  //       "01DMNDFTJ4MGBW9CXA3Y5N91W4": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "Servizi alla Mobilità Urbana",
  //           organization_fiscal_code: "80016350821",
  //           organization_name: "Comune di Palermo",
  //           service_id: "01DMNDFTJ4MGBW9CXA3Y5N91W4",
  //           service_metadata: {
  //             address: "Via Ausonia n.69",
  //             app_android:
  //               "https://play.google.com/store/apps/details?id=it.korec.palermomobilita",
  //             app_ios:
  //               "https://itunes.apple.com/it/app/ztl-palermo/id1166868545?mt=8",
  //             description:
  //               "Il servizio ZTL permette di gestire i propri permessi per la mobilità in città.\nTramite IO potrai:\n\n  * essere avvisato in tempi utili sulla scadenza del tuo permesso ZTL.\n",
  //             email:
  //               "ufficio.traffico@comune.palermo.it; mobilitaurbana@comune.palermo.it",
  //             pec: "mobilitaurbana@cert.comune.palermo.it",
  //             phone: "091 7401606",
  //             privacy_url:
  //               "https://www.comune.palermo.it/info-privacy.php?id=23",
  //             scope: "LOCAL",
  //             tos_url: "https://www.comune.palermo.it/info.php",
  //             web_url:
  //               "https://ztl.comune.palermo.it/ztl/jsp/home.do?sportello=ztl"
  //           },
  //           service_name: "Area ZTL",
  //           version: 7
  //         }
  //       },
  //       "01DNEZT8BC7MFM96Q4J0MS72E2": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "Area Servizi alla Persona",
  //           organization_fiscal_code: "03334231200",
  //           organization_name: "Comune di Valsamoggia",
  //           service_id: "01DNEZT8BC7MFM96Q4J0MS72E2",
  //           service_metadata: {
  //             address:
  //               "Piazza Berozzi 3 (loc. Crespellano) - 40053 Valsamoggia (BO)",
  //             description:
  //               "Il servizio di Pagamenti per Servizi scolastici offre la possibilità di gestire dei pagamenti direttamente attraverso l'app.\nTramite IO potrai:\n\n  * gestire il pagamento di servizi scolastici come nido d’infanzia, trasporto scolastico, prolungamento d’orario e buoni pasto a debito.\n",
  //             email: "inforette@comune.valsamoggia.bo.it",
  //             phone: "051 6723036",
  //             privacy_url:
  //               "https://www.comune.valsamoggia.bo.it/index.php/component/content/article/94-amministrazione-trasparente/2660-privacy-e-note-legali?Itemid=101",
  //             scope: "LOCAL",
  //             web_url:
  //               "https://www.comune.valsamoggia.bo.it/index.php/servizi-online-valsamoggia/98-aree-tematiche/scuola-e-giovani/servizi-scolastici/4147-pagamenti-nido-d-infanzia-trasporto-prolungamento-orario"
  //           },
  //           service_name: "Pagamenti per servizi scolastici",
  //           version: 13
  //         }
  //       },
  //       "01DPB2JK990ASH9C6B14Q43SH4": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "Area Tributi",
  //           organization_fiscal_code: "80016350821",
  //           organization_name: "Comune di Palermo",
  //           service_id: "01DPB2JK990ASH9C6B14Q43SH4",
  //           service_metadata: {
  //             address: "Piazza G. Cesare n.6",
  //             description:
  //               "Il servizio dei tributi sui rifiuti del Comune di Palermo.\nTramite IO potrai:\n\n  * ricevere notifiche sulla scadenza delle rate TARI, e procedere al pagamento online.\n",
  //             email: "settoretributi@comune.palermo.it",
  //             pec: "settoretributi@cert.comune.palermo.it",
  //             phone: "091 7404508; 091 7404501",
  //             privacy_url:
  //               "https://www.comune.palermo.it/info-privacy.php?id=22",
  //             scope: "LOCAL",
  //             tos_url: "https://www.comune.palermo.it/info.php",
  //             web_url:
  //               "https://servizionline.comune.palermo.it/portcitt/jsp/home.jsp?modo=info&info=servizi.jsp&ARECOD=10&S=40"
  //           },
  //           service_name: "Avviso TARI",
  //           version: 6
  //         }
  //       },
  //       "01DVQZ21YD356PH8V5G1S5KMN3": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "Servizi Scolastici",
  //           organization_fiscal_code: "00792720153",
  //           organization_name: "Comune di Garbagnate Milanese",
  //           service_id: "01DVQZ21YD356PH8V5G1S5KMN3",
  //           service_metadata: {
  //             address: "Piazza De Gasperi,1 - 20024 Garbagnate Milanese (MI)",
  //             description:
  //               "Il servizio di Iscrizione Pre e Post Scuola è relativo alle attività di pre e post scuola oranizzate nelle scuole primarie e scuole dell'infanzia del Comune di Garbagnate.\nTramite IO potrai:\n\n* ricevere un promemoria e procedere al pagamento del servizio;\n* essere informato in caso di pratiche rifiutate o scadute.\n",
  //             email: "prepost@comune.garbagnate-milanese.mi.it",
  //             pec: "prepost@comune.garbagnate-milanese.mi.it",
  //             phone: "02 78618200",
  //             privacy_url: "https://comune.garbagnate-milanese.mi.it/privacy/",
  //             scope: "LOCAL",
  //             web_url:
  //               "https://procedimenti.comune.garbagnate-milanese.mi.it/hrd/moduli-ufficio"
  //           },
  //           service_name: "Iscrizione pre e post scuola",
  //           version: 10
  //         }
  //       },
  //       "01DVQZ2G99HQ0GW27MSD1ECC9P": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "Servizi Scolastici",
  //           organization_fiscal_code: "00792720153",
  //           organization_name: "Comune di Garbagnate Milanese",
  //           service_id: "01DVQZ2G99HQ0GW27MSD1ECC9P",
  //           service_metadata: {
  //             address: "Piazza De Gasperi,1 - 20024 Garbagnate Milanese (MI)",
  //             description:
  //               "Il servizio di trasporto scolastico è erogato a favore degli alunni frequentanti la Scuola Primaria Karol Wojtyla e le due scuole Secondarie di Primo Grado Galilei e Morante.\nTramite IO potrai:\n\n* ricevere un promemoria e procedere al pagamento del servizio;\n+ essere informato in caso di pratiche rifiutate o scadute.\n",
  //             email: "prepost@comune.garbagnate-milanese.mi.it",
  //             pec: "prepost@comune.garbagnate-milanese.mi.it",
  //             phone: "02 78618200",
  //             privacy_url: "https://comune.garbagnate-milanese.mi.it/privacy/",
  //             scope: "LOCAL",
  //             web_url:
  //               "https://procedimenti.comune.garbagnate-milanese.mi.it/hrd/moduli-ufficio"
  //           },
  //           service_name: "Iscrizione trasporto scolastico",
  //           version: 9
  //         }
  //       },
  //       "01E1YAB4X63WG8BPBVR43KH3J1": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "Urbanistica",
  //           organization_fiscal_code: "02438750586",
  //           organization_name: "Roma Capitale",
  //           service_id: "01E1YAB4X63WG8BPBVR43KH3J1",
  //           service_metadata: {
  //             address:
  //               "Dipartimento Programmazione e Attuazione Urbanistica, Viale della Civiltà del Lavoro, 10 - Roma",
  //             description:
  //               "Il SUET è uno sportello telematico a disposizione dei cittadini e dei tecnici professionisti progettato per semplificare la presentazione delle comunicazioni e delle istanze necessarie per la realizzazione degli interventi edilizi, agevolarne l’istruttoria  da parte degli uffici competenti, monitorarne lo stato d’avanzamento da parte di tutti i soggetti interessati sino alla conclusione dell’intervento edilizio.\nTramite IO potrai ricevere informazioni sullo stato delle procedure edilizie in invio al SUET.\n",
  //             email: "ld.urbanistica@comune.roma.it",
  //             pec: "protocollo.urbanistica@pec.comune.roma.it",
  //             phone: "06 0606",
  //             privacy_url:
  //               "https://www.comune.roma.it/web/it/trattamento-dati-personali.page",
  //             scope: "LOCAL",
  //             web_url: "http://www.urbanistica.comune.roma.it/suet.html"
  //           },
  //           service_name: "Sportello Unico per l'Edilizia Telematico - SUET",
  //           version: 8
  //         }
  //       },
  //       "01E219K9CX4BHFJTGE868HPJ59": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "Anagrafe",
  //           organization_fiscal_code: "90001310631",
  //           organization_name: "Comune di Santa Maria la Carità",
  //           service_id: "01E219K9CX4BHFJTGE868HPJ59",
  //           service_metadata: {
  //             address:
  //               "Piazzale S.S. Giovanni Paolo II - Santa Maria la Carità",
  //             description:
  //               "Il servizio carta d'identità ti aiuta nella gestione del tuo documento.\nTramite IO potrai:\n\n* ricevere un promemoria in prossimità della scadenza della tua carta d'identità;\n* procedere al rinnovo della carta d'identità elettronica, e effettuare il pagamento necessario.\n",
  //             pec: "amministrativo.santamarialacarita@asmepec.it",
  //             phone: "081 3910111",
  //             scope: "LOCAL"
  //           },
  //           service_name: "Carta d'Identità",
  //           version: 8
  //         }
  //       },
  //       "01E2E0E80Z4TR72V43XVZGX4KF": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "Commercio e imprese",
  //           organization_fiscal_code: "02438750586",
  //           organization_name: "Roma Capitale",
  //           service_id: "01E2E0E80Z4TR72V43XVZGX4KF",
  //           service_metadata: {
  //             address:
  //               "Dipartimento Attività Produttive, Via dei Cerchi, 6 - Roma",
  //             description:
  //               "Lo Sportello Unico per le Attività Produttive (S.U.A.P.)  è uno strumento di semplificazione amministrativa che mira a coordinare tutti gli adempimenti richiesti per la creazione di imprese, al fine di snellire e semplificare i rapporti tra la pubblica amministrazione italiana e i cittadini.\nTramite IO potrai ricevere informazioni e avvisi sullo stato delle pratiche presentate al SUAP.\n",
  //             email: "urp.attivitaproduttive@comune.roma.it",
  //             pec: "protocollo.attivitaproduttive@pec.comune.roma.it",
  //             phone: "06 0606",
  //             privacy_url:
  //               "https://www.comune.roma.it/web/it/trattamento-dati-personali.page",
  //             scope: "LOCAL",
  //             web_url: "https://www.comune.roma.it/suap-portal/"
  //           },
  //           service_name: "Sportello Unico per le Attività Produttive -  SUAP",
  //           version: 7
  //         }
  //       },
  //       "01E2XCR1N4VNMG18XJ5BD4BV9Y": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "AREA SERVIZI ALLA PERSONA",
  //           organization_fiscal_code: "00168090348",
  //           organization_name: "Comune di Collecchio",
  //           service_id: "01E2XCR1N4VNMG18XJ5BD4BV9Y",
  //           service_metadata: {
  //             address: "Viale Libertà 3 - 43044 Collecchio (PR)",
  //             description:
  //               "I Servizi scolastici offrono la possibilità di gestire scadenze e pagamenti direttamente attraverso l'app.\nTramite IO potrai:\n\n  * ricevere promemoria per la scadenza dell'iscrizione ai servizi scolastici;\n  * gestire il pagamento di servizi scolastici come nido d’infanzia, trasporto scolastico, prolungamento d’orario e buoni pasto a debito.\n",
  //             email: "pubistr@comune.collecchio.pr.it",
  //             pec: "protocollo@postacert.comune.collecchio.pr.it",
  //             phone: "0521 301270",
  //             privacy_url:
  //               "http://www.comune.collecchio.pr.it/servizi/Menu/dinamica.aspx?idSezione=44824&idArea=100719&idCat=16889&ID=16889&TipoElemento=categoria",
  //             scope: "LOCAL",
  //             web_url:
  //               "http://www.comune.collecchio.pr.it/servizi/Menu/dinamica.aspx?idSezione=18144&idArea=18147&idCat=46030&ID=58480&TipoElemento=categoria"
  //           },
  //           service_name: "Pagamenti per Servizi scolastici",
  //           version: 12
  //         }
  //       },
  //       "01E36YVB7NDWK7FFF6DBNVDZTP": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "AREA SERVIZI ALLA PERSONA",
  //           organization_fiscal_code: "00442530341",
  //           organization_name: "Comune di Sala Baganza",
  //           service_id: "01E36YVB7NDWK7FFF6DBNVDZTP",
  //           service_metadata: {
  //             address: "via Vittorio Emanuele II, 34 - 43038 Sala Baganza (PR)",
  //             description:
  //               "I Servizi scolastici offrono la possibilità di gestire scadenze e pagamenti direttamente attraverso l'app.\nTramite IO potrai:\n\n  * ricevere promemoria per la scadenza dell'iscrizione ai servizi scolastici;\n  * gestire il pagamento di servizi scolastici come nido d’infanzia, trasporto scolastico, prolungamento d’orario e buoni pasto a debito.\n",
  //             email: "l.longhi@comune.sala-baganza.pr.it",
  //             pec: "protocollo@postacert.comune.sala-baganza.pr.it",
  //             privacy_url:
  //               "http://www.comune.sala-baganza.pr.it/servizi/Menu/dinamica.aspx?idSezione=55170&idArea=100026&idCat=55174&ID=55174&TipoElemento=categoria",
  //             scope: "LOCAL",
  //             web_url:
  //               "http://www.comune.sala-baganza.pr.it/servizi/Menu/dinamica.aspx?idSezione=41554&idArea=41639&idCat=35978&ID=36140&TipoElemento=categoria"
  //           },
  //           service_name: "Pagamenti per Servizi scolastici",
  //           version: 7
  //         }
  //       },
  //       "01E36YY11TMJAC7W9FH0ETF3QZ": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "AREA SERVIZI ALLA PERSONA",
  //           organization_fiscal_code: "92170530346",
  //           organization_name: "Comune di Montechiarugolo",
  //           service_id: "01E36YY11TMJAC7W9FH0ETF3QZ",
  //           service_metadata: {
  //             address: "Piazza Rivasi 3 - 43022 Montechiarugolo (PR)",
  //             description:
  //               "I Servizi scolastici offrono la possibilità di gestire scadenze e pagamenti direttamente attraverso l'app.\nTramite IO potrai:\n\n  * ricevere promemoria per la scadenza dell'iscrizione ai servizi scolastici;\n  * gestire il pagamento di servizi scolastici come nido d’infanzia, trasporto scolastico, prolungamento d’orario e buoni pasto a debito.\n",
  //             email: "scuola@comune.montechiarugolo.pr.it",
  //             pec: "protocollo@postacert.comune.montechiarugolo.pr.it",
  //             phone: "0521 687730",
  //             privacy_url:
  //               "http://www.comune.montechiarugolo.pr.it/servizi/Menu/dinamica.aspx?idSezione=43019&idArea=49243&idCat=55703&ID=100391&TipoElemento=categoria",
  //             scope: "LOCAL",
  //             web_url:
  //               "http://www.comune.montechiarugolo.pr.it/servizi/Menu/dinamica.aspx?idSezione=45696&idArea=59302&idCat=59302&ID=59302&TipoElemento=area"
  //           },
  //           service_name: "Pagamenti per Servizi scolastici",
  //           version: 9
  //         }
  //       },
  //       "01E4WV19MWPYYFMBTVAZSAGWPC": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "Servizi demografici",
  //           organization_fiscal_code: "00257850396",
  //           organization_name: "Comune di Bagnacavallo",
  //           service_id: "01E4WV19MWPYYFMBTVAZSAGWPC",
  //           service_metadata: {
  //             address: "Piazza Libertà, 5 - Bagnacavallo",
  //             description:
  //               "Il servizio di Anagrafe offre la possibilità di gestire i propri dati anagrafici, documenti in scadenza e dichiarazioni.\nTramite IO potrai:\n\n* essere informato sulla scadenza della tua carta d'identità;\n* ricevere un avviso che ti ricorda che il permesso di soggiorno risulta scaduto da almeno 6 mesi e che devi esibire il nuovo permesso in anagrafe.\n",
  //             email: "anagrafe@comune.bagnacavallo.ra.it",
  //             pec: "demografico.bagnacavallo@cert.unione.labassaromagna.it",
  //             phone: "0545 280884",
  //             privacy_url:
  //               "http://www.comune.bagnacavallo.ra.it/Guida-ai-servizi/Servizi-demografici/Informativa-Privacy",
  //             scope: "LOCAL",
  //             web_url:
  //               "http://www.comune.bagnacavallo.ra.it/Guida-ai-servizi/I-Servizi-dalla-A-alla-Z/Dichiarazioni-anagrafiche-iscrizione-anagrafica-con-provenienza-da-altro-comune-iscrizione-anagrafica-dall-estero-cambio-di-abitazione-all-interno-del-comune-emigrazione-all-estero"
  //           },
  //           service_name: "Anagrafe",
  //           version: 9
  //         }
  //       },
  //       "01E4XD5N8F4XH9ARGV3SAXMZT0": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "AREA SERVIZI ALLA PERSONA",
  //           organization_fiscal_code: "00202030342",
  //           organization_name: "Comune di Felino",
  //           service_id: "01E4XD5N8F4XH9ARGV3SAXMZT0",
  //           service_metadata: {
  //             address: "Pizza Miodini, 1 - 43045 Felino (PR)",
  //             description:
  //               "I Servizi scolastici offrono la possibilità di gestire scadenze e pagamenti direttamente attraverso l'app.\nTramite IO potrai:\n\n  * ricevere promemoria per la scadenza dell'iscrizione ai servizi scolastici;\n  * gestire il pagamento di servizi scolastici come nido d’infanzia, trasporto scolastico, prolungamento d’orario e buoni pasto a debito.\n",
  //             email: "f.bolondi@comune.felino.pr.it",
  //             pec: "protocollo@postacert.comune.felino.pr.it",
  //             phone: "0521 335920",
  //             privacy_url:
  //               "http://www.comune.felino.pr.it/servizi/Menu/dinamica.aspx?idSezione=41749&idArea=100592&idCat=61379&ID=61379&TipoElemento=categoria",
  //             scope: "LOCAL",
  //             web_url:
  //               "http://www.comune.felino.pr.it/servizi/Menu/dinamica.aspx?idSezione=41744&idArea=41902&idCat=62170&ID=62247&TipoElemento=categoria"
  //           },
  //           service_name: "Pagamenti per Servizi scolastici",
  //           version: 6
  //         }
  //       },
  //       "01E6C1NPEK6475G10YRJ139JJG": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "Anagrafe",
  //           organization_fiscal_code: "00441550357",
  //           organization_name: "Comune di Novellara",
  //           service_id: "01E6C1NPEK6475G10YRJ139JJG",
  //           service_metadata: {
  //             address: "P.le Marconi, 1 - Novellara",
  //             description:
  //               "I servizi anagrafici si occupano della gestione dei tuoi documenti d'identità. Tramite IO potrai:\n\n* ricevere un promemoria in prossimità della scadenza del tuo documento d'identità, e prenotare un appuntamento per ottenere il nuovo documento;\n* procedere al pagamento della nuova CIE (carta di identità elettronica).\n",
  //             email: "urp@comune.novellara.re.it",
  //             pec: "novellara@cert.provincia.re.it",
  //             phone: "0522 655454",
  //             privacy_url:
  //               "https://www.comune.novellara.re.it/servizi/gestionedocumentale/visualizzadocumento.aspx?ID=26654",
  //             scope: "LOCAL",
  //             web_url:
  //               "http://www.comune.novellara.re.it/servizi/procedimenti/ricerca_fase03.aspx?ID=8738"
  //           },
  //           service_name: "Servizi Demografici",
  //           version: 11
  //         }
  //       },
  //       "01E6TTG0VG6DFVFMCEZJQDDM39": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "AREA SERVIZI ALLA PERSONA",
  //           organization_fiscal_code: "00220040349",
  //           organization_name: "Comune di Traversetolo",
  //           service_id: "01E6TTG0VG6DFVFMCEZJQDDM39",
  //           service_metadata: {
  //             address: "Piazza Vittorio Veneto, 30 – 43029 Traversetolo (PR)",
  //             description:
  //               "I Servizi scolastici offrono la possibilità di gestire scadenze e pagamenti direttamente attraverso l'app.\nTramite IO potrai:\n\n  * ricevere promemoria per la scadenza dell'iscrizione ai servizi scolastici;\n  * gestire il pagamento di servizi scolastici come nido d’infanzia, trasporto scolastico, prolungamento d’orario e buoni pasto a debito.\n",
  //             email: "scuola@comune.traversetolo.pr.it",
  //             pec: "protocollo@postacert.comune.traversetolo.pr.it",
  //             phone: "0521 344549",
  //             privacy_url:
  //               "http://www.comune.traversetolo.pr.it/servizi/Menu/dinamica.aspx?idSezione=41612&idArea=100636&idCat=74227&ID=74227&TipoElemento=categoria",
  //             scope: "LOCAL",
  //             web_url:
  //               "http://www.comune.traversetolo.pr.it/servizi/Menu/dinamica.aspx?idSezione=41611&idArea=41628&idCat=46110&ID=47294&TipoElemento=pagina"
  //           },
  //           service_name: "Pagamenti per Servizi scolastici",
  //           version: 6
  //         }
  //       },
  //       "01E7MGBS956ADAH12N65TQZ83A": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "Sistema Informativo",
  //           organization_fiscal_code: "00304260409",
  //           organization_name: "Comune di Rimini",
  //           service_id: "01E7MGBS956ADAH12N65TQZ83A",
  //           service_metadata: {
  //             address: "Piazza Cavour 27 - 47921 Rimini",
  //             description:
  //               "Il portale permette l'inoltro di istanze e dichiarazioni digitali per lo svolgimento di procedimenti che riguardano la Pubblica Amministrazione.\nTramite IO potrai: \n\n* ricevere notifica dell'avvenuta protocollazione dell'istanza e ricevere informazioni sul procedimento amministrativo.\n",
  //             email: "hd@comune.rimini.it",
  //             pec: "protocollo.generale@pec.comune.rimini.it",
  //             phone: "0541 704111",
  //             privacy_url: "https://www.comune.rimini.it/privacy",
  //             scope: "LOCAL",
  //             web_url: "https://istanze-dichiarazioni.comune.rimini.it/"
  //           },
  //           service_name: "Istanze Digitali ",
  //           version: 4
  //         }
  //       },
  //       "01E8PWHM514G7YP06WPDMGH0V5": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "Servizi alla città - Servizi ai cittadini",
  //           organization_fiscal_code: "00145920351",
  //           organization_name: "Comune di Reggio Emilia",
  //           service_id: "01E8PWHM514G7YP06WPDMGH0V5",
  //           service_metadata: {
  //             address: "Via Toschi, 27 - 42121 Reggio Emilia",
  //             description:
  //               "Tramite i servizi demografici del Comune di Reggio Emilia su IO potrai:\n\n* ricevere un promemoria che ti avvisa della scadenza della tua carta di identità;\n* ricevere un promemoria dell'appuntamento fissato per il rinnovo del documento.\n",
  //             email: "servizidemografici@comune.re.it",
  //             pec: "comune.reggioemilia@pec.municipio.re.it",
  //             phone: "0522 585958",
  //             privacy_url: "https://www.comune.re.it/privacy",
  //             scope: "LOCAL",
  //             web_url:
  //               "https://www.comune.re.it/retecivica/urp/pes.nsf/web/vntdllvt?opendocument"
  //           },
  //           service_name: "Servizi Demografici",
  //           version: 8
  //         }
  //       },
  //       "01E983KMACRZ0MTWEKP6TVC0W6": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "Gestione Entrate",
  //           organization_fiscal_code: "00297960197",
  //           organization_name: "Comune di Cremona",
  //           service_id: "01E983KMACRZ0MTWEKP6TVC0W6",
  //           service_metadata: {
  //             address: "Piazza del Comune, 8 - Cremona",
  //             description:
  //               "Il Comune di Cremona aderisce al Sistema PagoPA per il pagamento TARI per utenze domestiche.\nSe ti sei registrato almeno 10 giorni prima della scadenza del pagamento, tramite IO potrai:\n\n* effettuare il pagamento dell’acconto TARI 2020 in rata unica;\n* effettuare il pagamento dell’acconto TARI 2020 in due rate separate;\n* effettuare il pagamento del saldo TARI 2020.\n",
  //             email: "tari@comune.cremona.it",
  //             pec: "protocollo@comunedicremona.legalmail.it",
  //             phone: "0372 4071",
  //             privacy_url: "https://www.comune.cremona.it/privacy",
  //             scope: "LOCAL",
  //             web_url: "https://www.comune.cremona.it"
  //           },
  //           service_name: "TARI",
  //           version: 10
  //         }
  //       },
  //       "01E9FQBB51N80EJ79Y1RFQC2XD": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "Attività produttive e edilizia",
  //           organization_fiscal_code: "00145920351",
  //           organization_name: "Comune di Reggio Emilia",
  //           service_id: "01E9FQBB51N80EJ79Y1RFQC2XD",
  //           service_metadata: {
  //             address: "Via Emilia a San Pietro, 12 - 42121 Reggio Emilia",
  //             description:
  //               "Tramite il servizio SUAP del Comune di Reggio Emilia su IO potrai:\n\n* ricevere avvisi di pagamento e di scadenze COSAP ed effettuare i pagamenti;\n* a breve, ricevere autorizzazioni COSAP.\n",
  //             pec: "comune.reggioemilia@pec.municipio.re.it",
  //             privacy_url: "https://www.comune.re.it/privacy",
  //             scope: "LOCAL",
  //             web_url:
  //               "https://www.comune.re.it/retecivica/urp/retecivi.nsf/PESUfficiTabellaWeb/73E1627A1503805AC12578620030D61B"
  //           },
  //           service_name: "SUAP - sviluppo, impresa e commercio",
  //           version: 6
  //         }
  //       },
  //       "01E9Z5M0N9FK3AQYXPZ4F0CKR9": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "Area amministrativo contabile",
  //           organization_fiscal_code: "84002330540",
  //           organization_name: "Comune di Campello sul Clitunno",
  //           service_id: "01E9Z5M0N9FK3AQYXPZ4F0CKR9",
  //           service_metadata: {
  //             address: "Piazza Ranieri Campello, 4 - Campello sul Clitunno",
  //             description:
  //               "Il servizio di Pagamenti per Refezione Scolastica offre la possibilità di gestire dei pagamenti direttamente attraverso l'app. oltre alle normali modalità di pagamento già previste.\nTramite IO potrai:\n\n* gestire il pagamento della mensa scolastica, ricevere avvisi e solleciti.\n",
  //             email: "area.finanziaria@comune.campello.pg.it",
  //             pec: "comune.campellosulclitunno@postacert.umbria.it",
  //             phone: "0743 271927; 0743 271946",
  //             privacy_url: "https://www.comune.campello.pg.it/pagine/privacy",
  //             scope: "LOCAL",
  //             web_url: "https://www.comune.campello.pg.it/"
  //           },
  //           service_name: "Servizio refezione scolastica",
  //           version: 5
  //         }
  //       },
  //       "01E9Z5V0EK8HS8KZV0CB12421Z": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "Area amministrativo contabile",
  //           organization_fiscal_code: "84002330540",
  //           organization_name: "Comune di Campello sul Clitunno",
  //           service_id: "01E9Z5V0EK8HS8KZV0CB12421Z",
  //           service_metadata: {
  //             address: "Piazza Ranieri Campello, 4 - Campello sul Clitunno",
  //             description:
  //               "Il servizio di Pagamenti dei Tributi limitatamente alla IMU e alla TARI avviene tramite F24, l'App IO per tali tributi provvedera' a inviare solleciti di versamento e avvisi vari. Per gli altri tributi comunali, in particolar modo la TOSAP riferita la Mercatino dell'Antiquariatodi Pissignano, la stessa offre la possibilità di gestire avvisi e solleciti ed i pagamenti direttamente attraverso l'app. oltre alle normali modalità di pagamento già previste.\nTramite IO potrai:\n\n* gestire il pagamento dei tributi comunali eccetto IMU e TARI la cui modalità rimane quella del F24, e ricevere comunicazioni e solleciti.\n",
  //             email: "area.finanziaria@comune.campello.pg.it",
  //             pec: "comune.campellosulclitunno@postacert.umbria.it",
  //             phone: "0743 271927; 0743 271946",
  //             privacy_url: "https://www.comune.campello.pg.it/pagine/privacy",
  //             scope: "LOCAL",
  //             web_url: "https://www.comune.campello.pg.it/"
  //           },
  //           service_name: "Servizio tributi",
  //           version: 6
  //         }
  //       },
  //       "01EA1R4S59VG36BPB7SDQXQKNN": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "Pianificazione Urbanistica",
  //           organization_fiscal_code: "00192320117",
  //           organization_name: "Comune di Sarzana",
  //           service_id: "01EA1R4S59VG36BPB7SDQXQKNN",
  //           service_metadata: {
  //             address: "Piazza Matteotti, 1 - Sarzana",
  //             description:
  //               "Il servizio informa il cittadino, impresa, professionista circa l'avvenuta richiesta di integrazioni prodotta dall'Ente in relazione al procedimento amministrativo avviato tramite portale e trasmesso per via telematica. \nTramite IO potrai:\n\n* ricevere eventuali avvisi di richiesta integrazione di una pratica precedentemente presentata.\n",
  //             email: "urp@comunesarzana.gov.it",
  //             pec: "protocollo.comune.sarzana@postecert.it",
  //             phone: "+39 0187 6141",
  //             privacy_url: "https://www.comunesarzana.gov.it/privacy.html",
  //             scope: "LOCAL",
  //             web_url:
  //               "http://cloud.urbi.it/urbi/progs/urp/solhome.sto?DB_NAME=n201753&areaAttiva=10"
  //           },
  //           service_name: "Pratiche Edilizie",
  //           version: 5
  //         }
  //       },
  //       "01EA1RD59JJPWY254P0FRT3VHC": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "Segreteria Generale",
  //           organization_fiscal_code: "00192320117",
  //           organization_name: "Comune di Sarzana",
  //           service_id: "01EA1RD59JJPWY254P0FRT3VHC",
  //           service_metadata: {
  //             address: "Piazza Matteotti, 1 - Sarzana",
  //             description:
  //               "Il servizio di avvisi per gli Atti Amministrativi permette di ricevere informazioni legate alle attività delle sedute collegiali (es. Giunta e Consiglio). \nTramite IO potrai:\n\n* ricevere l'avviso di convocazione alle sedute in programma.\n",
  //             email: "urp@comunesarzana.gov.it",
  //             pec: "protocollo.comune.sarzana@postecert.it",
  //             phone: "+39 0187 6141",
  //             privacy_url: "https://www.comunesarzana.gov.it/privacy.html",
  //             scope: "LOCAL",
  //             web_url: "https://www.comunesarzana.gov.it/"
  //           },
  //           service_name: "Convocazioni Sedute",
  //           version: 6
  //         }
  //       },
  //       "01EAC1S4YXN04WC6GZJ2HX9651": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "Innovazione e Sistemi informatici",
  //           organization_fiscal_code: "80016750483",
  //           organization_name: "Comune di Campi Bisenzio",
  //           service_id: "01EAC1S4YXN04WC6GZJ2HX9651",
  //           service_metadata: {
  //             address: "Piazza Dante, 36 - Campi Bisenzio",
  //             description:
  //               "F.I.D.O. ti avvisa quando il Comune registra una posizione debitoria (detta anche pagamento in attesa) a tuo nome.\nTramite IO potrai:\n\n* essere avvisato all'emissione di una posizione debitoria.\n",
  //             email: "fido@comune.campi-bisenzio.fi.it",
  //             pec: "comune.campi-bisenzio@postacert.toscana.it",
  //             phone: "055 89591",
  //             privacy_url: "https://www.comune.campi-bisenzio.fi.it/privacy",
  //             scope: "LOCAL",
  //             web_url: "https://www.comune.campi-bisenzio.fi.it/fido"
  //           },
  //           service_name: "F.I.D.O. Pagamenti",
  //           version: 9
  //         }
  //       },
  //       "01EAC1VBNAQ30AF1C0H8JTFGXN": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "Innovazione e Sistemi informatici",
  //           organization_fiscal_code: "80016750483",
  //           organization_name: "Comune di Campi Bisenzio",
  //           service_id: "01EAC1VBNAQ30AF1C0H8JTFGXN",
  //           service_metadata: {
  //             address: "Piazza Dante, 36 - Campi Bisenzio",
  //             description:
  //               "F.I.D.O. consente di presentare domande (dette in gergo burocratico istanze) al Comune. Tramite IO potrai:\n\n* ricevere una conferma alla presentazione della domanda;\n* ricevere dei reminder relativi a domande non inviate;\n* ricevere una comunicazione quando il Comune risponde a una tua domanda.\n",
  //             email: "fido@comune.campi-bisenzio.fi.it",
  //             pec: "comune.campi-bisenzio@postacert.toscana.it",
  //             phone: "055 89591",
  //             privacy_url: "https://www.comune.campi-bisenzio.fi.it/privacy",
  //             scope: "LOCAL",
  //             web_url: "https://www.comune.campi-bisenzio.fi.it/fido"
  //           },
  //           service_name: "F.I.D.O. Domande",
  //           version: 6
  //         }
  //       },
  //       "01EB8AXKNV6NMSP2R25KSGF743": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "Divisione servizi",
  //           organization_fiscal_code: "06363391001",
  //           organization_name: "Agenzia delle Entrate",
  //           service_id: "01EB8AXKNV6NMSP2R25KSGF743",
  //           service_metadata: {
  //             description:
  //               "L’incentivo per supportare le famiglie e il settore del turismo dopo il lockdown richiesto dal COVID-19.\nTramite IO potrai:\n* Richiedere e attivare il Bonus Vacanze dalla [sezione pagamenti](ioit://WALLET_HOME)\n* Visualizzare il Bonus Vacanze per spenderlo presso una stuttura ricettiva\n* Condividere il Bonus Vacanze con gli altri beneficiari del tuo nucleo familiare.\n",
  //             privacy_url:
  //               "https://io.italia.it/app-content/bonus_vacanze_tos.html",
  //             scope: "NATIONAL"
  //           },
  //           service_name: "Bonus Vacanze",
  //           version: 4
  //         }
  //       },
  //       "01ECMDBNECKX2FQATF37TQNSYQ": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "Area Tributi",
  //           organization_fiscal_code: "80005450616",
  //           organization_name: "Comune di Cancello ed Arnone",
  //           service_id: "01ECMDBNECKX2FQATF37TQNSYQ",
  //           service_metadata: {
  //             address: "Via Municipio, n. 1 - 1° Piano",
  //             description:
  //               "Il Servizio Tributi si occupa della gestione delle scadenze dei vari pagamenti. \nTramite IO potrai:\n\n* ricevere un promemoria  che ti avvisa della scadenza di pagamento della TARI, IMU, TOSAP;\n* ricevere l'avviso di accertamento per il mancato pagamento di rate scadute, e pagare il relativo importo.  \n",
  //             email: "comunedicancelloedarnone@gmail.com",
  //             pec: "ragioneria.cancelloarnone@asmepec.it",
  //             phone: "0823 1257516",
  //             privacy_url:
  //               "https://www.comune.cancelloedarnone.ce.it/documenti/privacy.html",
  //             scope: "LOCAL",
  //             web_url:
  //               "https://cloud.urbi.it/urbi/progs/urp/solhome.sto?DB_NAME=wt00002765&areaAttiva=1"
  //           },
  //           service_name: "Tributi",
  //           version: 12
  //         }
  //       },
  //       "01ECMDCWM0CAC98HZS7WHJZQQ1": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "Area Istruzione",
  //           organization_fiscal_code: "80005450616",
  //           organization_name: "Comune di Cancello ed Arnone",
  //           service_id: "01ECMDCWM0CAC98HZS7WHJZQQ1",
  //           service_metadata: {
  //             address: "Via Municipio, n. 1 - 1° Piano",
  //             description:
  //               "Il Servizio Refezione Scolastica si occupa della gestione della mensa.  \nTramite IO potrai:\n\n* ricevere un promemoria alla scadenza dell'iscrizione al servizio Refezione Scolastica;\n* ricevere un promemoria alla scadenza dei Buoni Pasto.  \n",
  //             email: "comunedicancelloedarnone@gmail.com",
  //             pec: "segreteria.cancelloarnone@asmepec.it",
  //             phone: "0823 1257515",
  //             privacy_url:
  //               "https://www.comune.cancelloedarnone.ce.it/documenti/privacy.html",
  //             scope: "LOCAL",
  //             web_url:
  //               "https://cloud.urbi.it/urbi/progs/urp/solhome.sto?DB_NAME=wt00002765&areaAttiva=1"
  //           },
  //           service_name: "Refezione Scolastica",
  //           version: 8
  //         }
  //       },
  //       "01ED912D869F64PZCPR1XQR61E": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "Area Istruzione",
  //           organization_fiscal_code: "00117380733",
  //           organization_name: "Comune di Grottaglie",
  //           service_id: "01ED912D869F64PZCPR1XQR61E",
  //           service_metadata: {
  //             address: "Via Martiri d’Ungheria snc – 74023 Grottaglie (TA)",
  //             description:
  //               "I Servizi Scolastici si occupano della gestione della mensa e del trasporto scolastico.  \nTramite IO potrai:\n\n* pagare la mensa scolastica;\n* pagare il trasporto scolastico;\n* ricevere una conferma del pagamento avvenuto.\n",
  //             email: "istruzione@comune.grottaglie.ta.it",
  //             pec: "istruzione.comunegrottaglie@pec.rupar.puglia.it",
  //             phone: "099 5620213",
  //             scope: "LOCAL",
  //             web_url: "https://comune.grottaglie.ta.it/privacy-policy/"
  //           },
  //           service_name: "Servizi Scolastici",
  //           version: 7
  //         }
  //       },
  //       "01EDE5Z3RHY0G67Y29WZF11J6G": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "Area Economica",
  //           organization_fiscal_code: "03334231200",
  //           organization_name: "Comune di Valsamoggia",
  //           service_id: "01EDE5Z3RHY0G67Y29WZF11J6G",
  //           service_metadata: {
  //             address:
  //               "Piazza Berozzi 3 (loc. Crespellano) - 40053 Valsamoggia (BO)",
  //             description:
  //               "Il Servizio Entrate del Comune di Valsamoggia si occupa della riscossione dei canoni di affitto e locazione di immobili e locali comunali. \nTramite IO potrai:\n\n* ricevere un promemoria che ti avvisa della scadenza di pagamento dei canoni;\n* ricevere l'avviso di accertamento per il mancato pagamento dei canoni, e pagare il relativo importo.\n",
  //             email: "tributi@comune.valsamoggia.bo.it",
  //             pec: "comune.valsamoggia@cert.provincia.bo.it",
  //             phone: "051 6723020",
  //             privacy_url:
  //               "https://www.comune.valsamoggia.bo.it/index.php/component/content/article/94-amministrazione-trasparente/2660-privacy-e-note-legali?Itemid=101",
  //             scope: "LOCAL"
  //           },
  //           service_name: "Canoni di affitto e locazione",
  //           version: 4
  //         }
  //       },
  //       "01EDE62JTDFATVRYV0CGBPNXX2": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "Area Economica",
  //           organization_fiscal_code: "03334231200",
  //           organization_name: "Comune di Valsamoggia",
  //           service_id: "01EDE62JTDFATVRYV0CGBPNXX2",
  //           service_metadata: {
  //             address:
  //               "Piazza Berozzi 3 (loc. Crespellano) - 40053 Valsamoggia (BO)",
  //             description:
  //               "Il Servizio Entrate del Comune di Valsamoggia si occupa della riscossione dei canoni della Luce votiva nei cimiteri comunali. \nTramite IO potrai:\n\n* ricevere un promemoria che ti avvisa della scadenza di pagamento dei canoni;\n* ricevere l'avviso di accertamento per il mancato pagamento dei canoni, e pagare il relativo importo.\n",
  //             email: "tributi@comune.valsamoggia.bo.it",
  //             pec: "comune.valsamoggia@cert.provincia.bo.it",
  //             phone: "051 6723013",
  //             privacy_url:
  //               "https://www.comune.valsamoggia.bo.it/index.php/component/content/article/94-amministrazione-trasparente/2660-privacy-e-note-legali?Itemid=101",
  //             scope: "LOCAL",
  //             web_url:
  //               "https://www.comune.valsamoggia.bo.it/index.php/component/content/article/91-aree-tematiche/famiglia-nascite-decessi-unioni-separazioni/844-gestione-servizio-illuminazione-votiva-nei-cimiteri-comunali"
  //           },
  //           service_name: "Luce votiva",
  //           version: 4
  //         }
  //       },
  //       "01EDVBSFKB1WHWHJW915SYER7F": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "Servizio demografico ed elettorale",
  //           organization_fiscal_code: "00259810232",
  //           organization_name: "Comune di Sommacampagna",
  //           service_id: "01EDVBSFKB1WHWHJW915SYER7F",
  //           service_metadata: {
  //             address: "Piazza Carlo Alberto, 1 - 37066 Sommacampagna",
  //             description:
  //               "Il servizio di Pagamenti per i servizi demografici offre la possibilità di gestire dei pagamenti direttamente attraverso l'app IO (oltre alle normali modalità di pagamento già previste). \nTramite IO potrai ricevere avvisi per:\n\n* pagamento delle concessioni cimiteriali;\n* pagamento dei servizi cimiteriali;\n* pagamento dei diritti di segreteria su certificazioni anagrafiche;\n* pagamento dei diritti di emissione carte d'identità.\n",
  //             email: "servizi.demografici@comune.sommacampagna.vr.it",
  //             pec: "sommacampagna.vr@cert.ip-veneto.net",
  //             phone: "045 8971340",
  //             privacy_url:
  //               "https://www.comune.sommacampagna.vr.it/home/info/privacy.html",
  //             scope: "LOCAL",
  //             web_url: "https://sommacampagna.comune.plugandpay.it"
  //           },
  //           service_name: "Pagamenti servizi demografici",
  //           version: 5
  //         }
  //       },
  //       "01EDVC0034TXCADN1XFY4375VS": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "Servizi scolastici",
  //           organization_fiscal_code: "00259810232",
  //           organization_name: "Comune di Sommacampagna",
  //           service_id: "01EDVC0034TXCADN1XFY4375VS",
  //           service_metadata: {
  //             address: "Piazza Carlo Alberto, 1 - 37066 Sommacampagna",
  //             description:
  //               "Il servizio di Pagamenti per i servizi scolastici  offre la possibilità di gestire dei pagamenti direttamente attraverso l'app IO (oltre alle normali modalità di pagamento già previste). \nTramite IO potrai ricevere avvisi per:\n\n* pagamento delle Trasporto scolastico;\n* pagamento della mensa scuola infanzia;\n* pagamento della mensa scuola primaria;\n* pagamento delle attività estive ed extrascolastiche.\n",
  //             email: "servizi.scuola@comune.sommacampagna.vr.it",
  //             pec: "sommacampagna.vr@cert.ip-veneto.net",
  //             phone: "045 8971386",
  //             privacy_url:
  //               "https://www.comune.sommacampagna.vr.it/home/info/privacy.html",
  //             scope: "LOCAL",
  //             web_url: "https://sommacampagna.comune.plugandpay.it"
  //           },
  //           service_name: "Pagamenti servizi scolastici",
  //           version: 5
  //         }
  //       },
  //       "01EDVC3RWMJV1NT9YH4J141B9S": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "Servizio tributi",
  //           organization_fiscal_code: "00259810232",
  //           organization_name: "Comune di Sommacampagna",
  //           service_id: "01EDVC3RWMJV1NT9YH4J141B9S",
  //           service_metadata: {
  //             address: "Piazza Carlo Alberto, 1 - 37066 Sommacampagna",
  //             description:
  //               "Il servizio di Pagamenti per i servizi tributi  offre la possibilità di gestire dei pagamenti direttamente attraverso l'app IO (oltre alle normali modalità di pagamento già previste). \nTramite IO potrai ricevere avvisi per:\n\n* pagamento della TOSAP;\n* pagamento delle Tabelle Passo Carraio.\n",
  //             email: "ufficio.tributi@comune.sommacampagna.vr.it",
  //             pec: "sommacampagna.vr@cert.ip-veneto.net",
  //             phone: "045 8971335",
  //             privacy_url:
  //               "https://www.comune.sommacampagna.vr.it/home/info/privacy.html",
  //             scope: "LOCAL",
  //             web_url: "https://sommacampagna.comune.plugandpay.it"
  //           },
  //           service_name: "Pagamenti servizi tributi",
  //           version: 5
  //         }
  //       },
  //       "01EDY252DS9HTNNHRJ83PRXAVA": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "Finanziario",
  //           organization_fiscal_code: "80034870636",
  //           organization_name: "Comune di Villaricca",
  //           service_id: "01EDY252DS9HTNNHRJ83PRXAVA",
  //           service_metadata: {
  //             address: "Corso Vittorio Emanuele, 76 - 80010 Villaricca Napoli",
  //             description:
  //               "Il servizio di avviso scadenza TOSAP permette di ricevere un promemoria alla scadenza del pagamento della Tosap.\n",
  //             email: "vittoriaferrara@comune.villaricca.na.it",
  //             phone: "081 8191111",
  //             privacy_url: "http://www.comune.villaricca.na.it/privacy.html",
  //             scope: "LOCAL",
  //             web_url:
  //               "http://asp.urbi.it/urbi/progs/urp/solhome.sto?DB_NAME=n200095"
  //           },
  //           service_name: "Avviso scadenza Tosap",
  //           version: 13
  //         }
  //       },
  //       "01EDY3N93S3WR6ZTP5G1WZ9YG9": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "Finanziario",
  //           organization_fiscal_code: "80034870636",
  //           organization_name: "Comune di Villaricca",
  //           service_id: "01EDY3N93S3WR6ZTP5G1WZ9YG9",
  //           service_metadata: {
  //             address: "Corso Vittorio Emanuele, 76 - 80010 Villaricca Napoli",
  //             description:
  //               "Il servizio di avviso scadenza TARI permette di ricevere un promemoria alla scadenza del pagamento della TARI.\n",
  //             email: "vittoriaferrara@comune.villaricca.na.it",
  //             phone: "081 8191111",
  //             privacy_url: "http://www.comune.villaricca.na.it/privacy.html",
  //             scope: "LOCAL",
  //             web_url:
  //               "http://asp.urbi.it/urbi/progs/urp/solhome.sto?DB_NAME=n200095"
  //           },
  //           service_name: "Avviso scadenza TARI",
  //           version: 9
  //         }
  //       },
  //       "01EEA5C29SJEE918D2AE1SH68H": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "Area Contabile",
  //           organization_fiscal_code: "81001470616",
  //           organization_name: "Comune di Carinaro",
  //           service_id: "01EEA5C29SJEE918D2AE1SH68H",
  //           service_metadata: {
  //             address: "P.zza Municipio, 1 - Carinaro",
  //             description:
  //               "Il servizio di avviso scadenza TARI permette di ricevere un promemoria alla scadenza del pagamento della TARI.\n",
  //             email: "elena.barbato@comune.carinaro.ce.it",
  //             pec: "elena.barbato@carinaro.telecompost.it",
  //             phone: "081 5029209",
  //             privacy_url:
  //               "http://www.comune.carinaro.ce.it/carinaro/area_gen/demografico/privacy.jsp",
  //             scope: "LOCAL",
  //             web_url: "http://www.comune.carinaro.ce.it"
  //           },
  //           service_name: "Avviso scadenza TARI",
  //           version: 9
  //         }
  //       },
  //       "01EHC02SVSKQ2M97DDSY3HAJWN": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "Area Tributi",
  //           organization_fiscal_code: "00117380733",
  //           organization_name: "Comune di Grottaglie",
  //           service_id: "01EHC02SVSKQ2M97DDSY3HAJWN",
  //           service_metadata: {
  //             address: "Via Martiri d’Ungheria snc – 74023 Grottaglie (TA)",
  //             description:
  //               "I Tributi Minori riguardano le concessioni di suolo pubblico, la pubblicità e le affissioni.   \nTramite IO potrai:\n\n* pagare la COSAP Permanente e Temporanea;\n* pagare le pubbliche affissioni;\n* pagare l’Imposta Comunale sulla Pubblicità (ICP);\n* ricevere una conferma del pagamento avvenuto.\n",
  //             email: "tributi@comune.grottaglie.ta.it",
  //             pec: "tributi.comunegrottaglie@pec.rupar.puglia.it",
  //             phone: "099 5620248",
  //             scope: "LOCAL",
  //             web_url: "https://comune.grottaglie.ta.it/privacy-policy/"
  //           },
  //           service_name: "Tributi Minori",
  //           version: 5
  //         }
  //       },
  //       "01EHC0FY33PQFJXWQJ99K108J8": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "Area Servizi Demografici",
  //           organization_fiscal_code: "00117380733",
  //           organization_name: "Comune di Grottaglie",
  //           service_id: "01EHC0FY33PQFJXWQJ99K108J8",
  //           service_metadata: {
  //             address: "Via Martiri d’Ungheria snc – 74023 Grottaglie (TA)",
  //             description:
  //               "I Servizi Demografici emettono le Carte di Identità e stilano atti vari che necessitano di Bollo.   \nTramite IO potrai:\n\n* pagare la Carta d’Identità Elettronica o Cartacea;\n* pagare il Bollo Virtuale per gli atti pubblici\n* ricevere una conferma del pagamento avvenuto.\n",
  //             email: "demografici@comune.grottaglie.ta.it",
  //             pec: "anagrafe.comunegrottaglie@pec.rupar.puglia.it",
  //             phone: "099 5620217",
  //             scope: "LOCAL",
  //             web_url: "https://comune.grottaglie.ta.it/privacy-policy/"
  //           },
  //           service_name: "Servizi Demografici",
  //           version: 4
  //         }
  //       },
  //       "01EHC0HHDCT3WK0G04SFBMT44E": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "Area Servizi Gestioni Dirette",
  //           organization_fiscal_code: "00117380733",
  //           organization_name: "Comune di Grottaglie",
  //           service_id: "01EHC0HHDCT3WK0G04SFBMT44E",
  //           service_metadata: {
  //             address: "Via Martiri d’Ungheria snc – 74023 Grottaglie (TA)",
  //             description:
  //               "I Servizi Cimiteriali si occupano delle concessioni per cappelle, loculi e quant’altro e gestiscono il servizio di lampade votive.   \nTramite IO potrai:\n\n* pagare il canone Lampade Votive;\n* ricevere una conferma del pagamento avvenuto.\n",
  //             email: "ggdd@comune.grottaglie.ta.it",
  //             pec: "ggdd.comunegrottaglie@pec.rupar.puglia.it",
  //             phone: "099 5620280",
  //             scope: "LOCAL",
  //             web_url: "https://comune.grottaglie.ta.it/privacy-policy/"
  //           },
  //           service_name: "Servizi Cimiteriali",
  //           version: 5
  //         }
  //       },
  //       "01EHC41R5RKPCZCEPNF8A8XWWN": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name:
  //             "Servizi alla Cittadinanza - Ufficio Servizi alla persona",
  //           organization_fiscal_code: "00246880397",
  //           organization_name: "Comune di Russi",
  //           service_id: "01EHC41R5RKPCZCEPNF8A8XWWN",
  //           service_metadata: {
  //             address: "Via Cavour, 21 - Russi",
  //             description:
  //               "Il servizio offre la possibilità di gestire i pagamenti dei servizi scolastici direttamente attraverso l'applicazione IO. Qui riceverai l’avviso pagoPA e potrai decidere come pagarlo:\n* subito con l’app IO e la carta di credito;\n* sul sito del Comune scegliendo tra carta di credito, addebito in conto e altri metodi. \n\nI codici presenti nell’avviso pagoPA ti permetteranno, in alternativa, di scegliere se pagare:\n* con il tuo home banking;\n* presso gli sportelli della tua banca;\n* presso gli uffici postali;\n* presso i punti vendita SISAL, Lottomatica e Banca 5.\n",
  //             email: "istruzione@comune.russi.ra.it",
  //             pec: "pg.comune.russi.ra.it@legalmail.it",
  //             phone: "0544 587648",
  //             scope: "LOCAL"
  //           },
  //           service_name: "Pagamenti Servizi Scolastici",
  //           version: 5
  //         }
  //       },
  //       "01EHSJ7H1KEE33PMJTMP670Z35": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "Area amministrativa",
  //           organization_fiscal_code: "06432250485",
  //           organization_name: "Consorzio di Bonifica 3 Medio Valdarno",
  //           service_id: "01EHSJ7H1KEE33PMJTMP670Z35",
  //           service_metadata: {
  //             address: "Via del Cantone 135 - 50019 Sesto Fiorentino (FI)",
  //             description:
  //               "Il servizio offre la possibilità di gestire i pagamenti direttamente attraverso l'app, oltre alle normali modalità di pagamento già previste. Tramite IO potrai ricevere avvisi per il pagamento di:\n\n* contributo consortile;\n* canone di concessione precaria.  \n",
  //             email: "contributi@cbmv.it",
  //             pec: "info@pec.cbmv.it",
  //             phone: "800 672 242",
  //             privacy_url: "https://www.cbmv.it/privacy-policy",
  //             scope: "LOCAL",
  //             tos_url: "https://www.cbmv.it/contributi-di-bonifica"
  //           },
  //           service_name:
  //             "Riscossione Contributo Consortile e/o Canone di Concessione Precaria",
  //           version: 6
  //         }
  //       },
  //       "01EHWBMQ91QPTWECS5AW8W6W5P": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "Servizi Cimiteriali",
  //           organization_fiscal_code: "83000710265",
  //           organization_name: "Comune di Cornuda",
  //           service_id: "01EHWBMQ91QPTWECS5AW8W6W5P",
  //           service_metadata: {
  //             address: "Piazza Giovanni XXIII 1 - 31041 Cornuda",
  //             description:
  //               "Il servizio di Pagamenti per i servizi cimiteriali offre la possibilità di gestire dei pagamenti direttamente attraverso l'app oltre alle normali modalità di pagamento già previste.\nTramite IO potrai ricevere avvisi per:                                                                                                                                                                                                            \n* pagamento delle concessioni cimiteriali;\n* pagamento dei diritti cimiteriali;\n* pagamento del rimborso di cremazione.  \n",
  //             email: "segreteria@comune.cornuda.tv.it",
  //             pec: "protocollo.comune.cornuda.tv@pecveneto.it",
  //             phone: "0423 040400",
  //             privacy_url:
  //               "https://www.comune.cornuda.tv.it/home/info/privacy-policy.html",
  //             scope: "LOCAL",
  //             web_url: "https://cornuda.comune.plugandpay.it/"
  //           },
  //           service_name: "Pagamenti Servizi Cimiteriali",
  //           version: 6
  //         }
  //       },
  //       "01EHWBSWXBJ3ZW7BABKG8Y5TMB": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "Servizi al Cittadino",
  //           organization_fiscal_code: "83000710265",
  //           organization_name: "Comune di Cornuda",
  //           service_id: "01EHWBSWXBJ3ZW7BABKG8Y5TMB",
  //           service_metadata: {
  //             address: "Piazza Giovanni XXIII 1 - 31041 Cornuda",
  //             description:
  //               "Il servizio di Pagamenti per i servizi al cittadino offre la possibilità di gestire dei pagamenti direttamente attraverso l'app oltre alle normali modalità di pagamento già previste.\nTramite IO potrai ricevere avvisi per:                                                                                                                                                                                                            \n* pagamento del trasporto scolastico;\n* pagamento del trasporto soggiorni climatici;\n* pagamento dei centri estivi;\n* pagamento della tassa di concorso;\n* pagamento delle celebrazioni matrimoni;\n* pagamento del servizio di assistenza domiciliare;\n* pagamento della trasporto;\n* pagamento dell'utilizzo sale pubbliche;\n* pagamento della vendita legname.\n",
  //             email: "ragioneria@comune.cornuda.tv.it",
  //             pec: "protocollo.comune.cornuda.tv@pecveneto.it",
  //             phone: "0423 040400",
  //             privacy_url:
  //               "https://www.comune.cornuda.tv.it/home/info/privacy-policy.html",
  //             scope: "LOCAL",
  //             web_url: "https://cornuda.comune.plugandpay.it/"
  //           },
  //           service_name: "Pagamenti Servizi al Cittadino",
  //           version: 5
  //         }
  //       },
  //       "01EHY17SEV6YYG6Z1CSAQGM8MC": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "Area Anagrafe",
  //           organization_fiscal_code: "80005450616",
  //           organization_name: "Comune di Cancello ed Arnone",
  //           service_id: "01EHY17SEV6YYG6Z1CSAQGM8MC",
  //           service_metadata: {
  //             address: "Via Municipio, n. 1 - Piano Terra",
  //             description:
  //               "Il Servizio di Anagrafe offre la possibilità di gestire i propri dati anagrafici, documenti in scadenza e dichiarazioni.  \nTramite IO potrai:\n\n* essere informato sulla scadenza della tua carta d'identità;\n* ricevere un avviso che ti ricorda che il permesso di soggiorno risulta scaduto da alemno 6 mesi e che devi esibire il nuovo permesso in anagrafe.   \n",
  //             email: "comunedicancelloedarnone@gmail.com",
  //             pec: "anagrafe.cancelloarnone@asmepec.it",
  //             phone: "0823 1257507",
  //             privacy_url:
  //               "https://www.comune.cancelloedarnone.ce.it/documenti/privacy.html",
  //             scope: "LOCAL",
  //             web_url:
  //               "https://cloud.urbi.it/urbi/progs/urp/solhome.sto?DB_NAME=wt00002765&areaAttiva=1"
  //           },
  //           service_name: "Anagrafe",
  //           version: 4
  //         }
  //       },
  //       "01EHY18EHZEDCTEHNF3T6RP49F": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "Area Cimiteri",
  //           organization_fiscal_code: "80005450616",
  //           organization_name: "Comune di Cancello ed Arnone",
  //           service_id: "01EHY18EHZEDCTEHNF3T6RP49F",
  //           service_metadata: {
  //             address: "Via Municipio, n. 1",
  //             description:
  //               "Il Servizio Cimiteri si occupa della riscossione dei canoni della Luce votiva e delle spese condominiali dei loculi.  \nTramite IO potrai:\n\n* ricevere un promemoria che ti avvisa della scadenza di pagamento dei canoni;\n* ricevere l'avviso di accertamento per il mancato pagamento dei canoni, e pagare il relativo importo.   \n",
  //             email: "comunedicancelloedarnone@gmail.com",
  //             pec: "protocollo.cancelloarnone@asmepec.it",
  //             phone: "0823 856176",
  //             privacy_url:
  //               "https://www.comune.cancelloedarnone.ce.it/documenti/privacy.html",
  //             scope: "LOCAL",
  //             web_url: "http://www.comune.cancelloedarnone.ce.it/"
  //           },
  //           service_name: "Cimiteri",
  //           version: 5
  //         }
  //       },
  //       "01EHY18TQYNE7S325G7TEKF322": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "Servizi al Cittadino",
  //           organization_fiscal_code: "80005450616",
  //           organization_name: "Comune di Cancello ed Arnone",
  //           service_id: "01EHY18TQYNE7S325G7TEKF322",
  //           service_metadata: {
  //             address: "Via Municipio, n. 1",
  //             description:
  //               "Sportello Facile è un servizio on-line che consente a tutti i cittadini di effettuare delle prenotazioni di appuntamento presso diversi sportelli.  \nTramite IO potrai:\n\n* ricevere un promemoria che ti ricorda data e orario di un appuntamento prenotato presso un ufficio comunale;\n* essere notificato in caso di modifica o disdetta dell'appuntamento.   \n",
  //             email: "comunedicancelloedarnone@gmail.com",
  //             pec: "protocollo.cancelloarnone@asmepec.it",
  //             phone: "0823 856176",
  //             privacy_url:
  //               "https://www.comune.cancelloedarnone.ce.it/documenti/privacy.html",
  //             scope: "LOCAL",
  //             web_url: "http://www.comune.cancelloedarnone.ce.it/"
  //           },
  //           service_name: "Sportello Facile",
  //           version: 4
  //         }
  //       },
  //       "01EJXN09K6WA7QQPQ7YG5HA4XP": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "Area 2",
  //           organization_fiscal_code: "00623530136",
  //           organization_name: "Comune di Lecco",
  //           service_id: "01EJXN09K6WA7QQPQ7YG5HA4XP",
  //           service_metadata: {
  //             address: "Piazza Diaz, 1 - 23900 Lecco (LC)",
  //             description:
  //               "Il servizio TARI del Comune di Lecco è disponibile sull'app IO.\nTramite IO potrai:\n\n* ricevere notifiche sulle scadenze delle rate TARI;\n* effettuare il pagamento della TARI;\n* ricevere comunicazioni inerenti al servizio.\n",
  //             pec: "comune@pec.comunedilecco.it",
  //             phone: "0341 481221",
  //             privacy_url: "http://www.comune.lecco.it/index.php/privacy",
  //             scope: "LOCAL",
  //             tos_url: "http://www.comune.lecco.it/index.php/note-legali",
  //             web_url: "http://sportellotel.servizienti.it/lecco/"
  //           },
  //           service_name: "Servizio Tributi – TARI",
  //           version: 25
  //         }
  //       },
  //       "01EK0738Y1HDNXFHRQZ54SQSK7": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "Servizio Illuminazione Votiva",
  //           organization_fiscal_code: "87007530170",
  //           organization_name: "Garda Uno S.p.a.",
  //           service_id: "01EK0738Y1HDNXFHRQZ54SQSK7",
  //           service_metadata: {
  //             address: "Via Italo Barbieri 20 - 25080 Padenghe sul Garda SpA",
  //             description:
  //               "Garda Uno svolge il Servizio di Illuminazione Votiva nei Comuni di Toscolano Maderno e di Gardone Riviera. \nIl servizio è rivolto a coloro che desiderano attivare un punto luminoso sulla tomba di un proprio Caro quale Luce Votiva.\nTramite IO potrai:\n\n* ricevere l'avviso di pagamento all'emissione della bolletta, e procedere al pagamento.\n",
  //             pec: "protocollo@pec.gardauno.it",
  //             phone: "030 9995401",
  //             privacy_url: "https://www.gardauno.it/it/privacy-policy",
  //             scope: "LOCAL",
  //             web_url: "https://www.gardauno.it/it/servizi/energia"
  //           },
  //           service_name: "Illuminazione Votiva",
  //           version: 9
  //         }
  //       },
  //       "01EKAKNKAW7YY57P09ZT0BT3ND": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "Igiene Urbana",
  //           organization_fiscal_code: "87007530170",
  //           organization_name: "Garda Uno S.p.a.",
  //           service_id: "01EKAKNKAW7YY57P09ZT0BT3ND",
  //           service_metadata: {
  //             address: "Via Italo Barbieri 20 - 25080 Padenghe sul Garda SpA",
  //             description:
  //               "Garda Uno esercisce il Servizio di Igiene Urbana in 24 Comuni della Provincia di Brescia. Il servizio qui offerto consente il pagamento degli avvisi di pagamento emessi a fronte di specifiche prestazioni (passaggi straordinari e personalizzati, forniture di contenitori di raccolta, ecc.).\nTramite IO potrai:\n\n* ricevere l'avviso di pagamento a fronte di specifiche prestazioni, e procedere al pagamento.\n",
  //             pec: "protocollo@pec.gardauno.it",
  //             phone: "030 9995401",
  //             privacy_url: "https://www.gardauno.it/it/privacy-policy",
  //             scope: "LOCAL",
  //             web_url: "https://www.gardauno.it/it/servizi/igiene-urbana"
  //           },
  //           service_name: "Servizio Igiene Urbana",
  //           version: 10
  //         }
  //       },
  //       "01EKAMCZ8592P034H91Y8MV7R5": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "Attività Produttive",
  //           organization_fiscal_code: "87007530170",
  //           organization_name: "Garda Uno S.p.a.",
  //           service_id: "01EKAMCZ8592P034H91Y8MV7R5",
  //           service_metadata: {
  //             address: "Via Italo Barbieri 20 - 25080 Padenghe sul Garda SpA",
  //             description:
  //               "Garda Uno esercisce Servizi di Mobilità e di gestione di Impianti Fotovoltaici nel territorio gardesano a fronte dei quali possono essere emesse fatture con annesso un avviso di pagamento che potrà essere pagato attraverso questo canale.\nTramite IO potrai:\n\n* ricevere l'avviso di pagamento, e procedere al pagamento.\n",
  //             pec: "protocollo@pec.gardauno.it",
  //             phone: "030 9995401",
  //             privacy_url: "https://www.gardauno.it/it/privacy-policy",
  //             scope: "LOCAL",
  //             web_url: "https://www.gardauno.it/it/servizi/energia"
  //           },
  //           service_name: "Servizio Attività Produttive",
  //           version: 7
  //         }
  //       },
  //       "01EM1AWDX0X4MWQW7D2FJHTC72": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "Settore I - Servizi per la Persona",
  //           organization_fiscal_code: "00235880366",
  //           organization_name: "Comune di Sassuolo",
  //           service_id: "01EM1AWDX0X4MWQW7D2FJHTC72",
  //           service_metadata: {
  //             address: "Via Fenuzzi, 5 - 41049 - Sassuolo",
  //             description:
  //               "Il servizio informa il cittadino sull'andamento delle domande online e sullo stato delle posizioni debitorie. \nTramite IO potrai:\n\n* ricevere un avviso di apertura delle iscrizioni ai servizi scolastici;\n* ricevere un avviso di apertura di bandi per la richiesta di contributi;\n* ricevere un messaggio relativo all'emissione di un avviso di pagamento;\n* ricevere la conferma di documenti disponibili;\n* ricevere un avviso di pre-ruolo.\n",
  //             email: "urp@comune.sassuolo.mo.it",
  //             pec: "comune.sassuolo@cert.comune.sassuolo.mo.it",
  //             phone: "0536 880801",
  //             privacy_url: "https://www.comune.sassuolo.mo.it/footer/privacy",
  //             scope: "LOCAL",
  //             web_url: "https://portale-sassuolo.entranext.it"
  //           },
  //           service_name: "Servizio Istruzione",
  //           version: 3
  //         }
  //       },
  //       "01EM1AYAV7Z5J41ZNNH7RSEQ5F": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "Settore I - Servizi alla Persona",
  //           organization_fiscal_code: "84002010365",
  //           organization_name: "Comune di Prignano sulla Secchia",
  //           service_id: "01EM1AYAV7Z5J41ZNNH7RSEQ5F",
  //           service_metadata: {
  //             address: "via Mario Allegretti, 216 - 41048 - Prignano s/S",
  //             description:
  //               "Il servizio informa il cittadino sull'andamento delle domande online e sullo stato delle posizioni debitorie. \nTramite IO potrai:\n\n* ricevere un avviso di apertura delle iscrizioni ai servizi scolastici;\n* ricevere un avviso di apertura di bandi per la richiesta di contributi;\n* ricevere un messaggio relativo all'emissione di un avviso di pagamento;\n* ricevere la conferma di documenti disponibili;\n* ricevere un avviso di pre-ruolo.\n",
  //             email: "segreteria@comune.prignano.mo.it",
  //             pec: "comune.prignano@pec.it",
  //             phone: "0536 892911",
  //             privacy_url: "https://www.comune.prignano.mo.it/footer/privacy",
  //             scope: "LOCAL",
  //             web_url: "https://portale-prignanoss.entranext.it/"
  //           },
  //           service_name: "Servizi Scolastici",
  //           version: 5
  //         }
  //       },
  //       "01EM1AZXRQ1PA5XKHHBN18W5C6": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "Servizio Affari Generali",
  //           organization_fiscal_code: "00415030360",
  //           organization_name: "Comune di Palagano",
  //           service_id: "01EM1AZXRQ1PA5XKHHBN18W5C6",
  //           service_metadata: {
  //             address: "Via 23 Dicembre, 74 - 41046 - Palagano",
  //             description:
  //               "Il servizio informa il cittadino sull'andamento delle domande online e sullo stato delle posizioni debitorie. \nTramite IO potrai:\n\n* ricevere un avviso di apertura delle iscrizioni ai servizi scolastici;\n* ricevere un avviso di apertura di bandi per la richiesta di contributi;\n* ricevere un messaggio relativo all'emissione di un avviso di pagamento;\n* ricevere la conferma di documenti disponibili;\n* ricevere un avviso di pre-ruolo.\n",
  //             email: "segreteria@comune.palagano.mo.it",
  //             pec: "comune.palagano@pec.it",
  //             phone: "0536 970911",
  //             privacy_url: "https://www.comune.palagano.mo.it/footer/privacy",
  //             scope: "LOCAL",
  //             web_url: "https://portale-palagano.entranext.it/"
  //           },
  //           service_name: "Ufficio Scuola",
  //           version: 4
  //         }
  //       },
  //       "01EM1B35MHJG5G47QPS0KE0KAR": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "Settore III - Servizi al Cittadino",
  //           organization_fiscal_code: "00495090367",
  //           organization_name: "Comune di Montefiorino",
  //           service_id: "01EM1B35MHJG5G47QPS0KE0KAR",
  //           service_metadata: {
  //             address: "Via Rocca, 1 - 41045 Montefiorino",
  //             description:
  //               "Il servizio informa il cittadino sull'andamento delle domande online e sullo stato delle posizioni debitorie. \nTramite IO potrai:\n\n* ricevere un avviso di apertura delle iscrizioni ai servizi scolastici;\n* ricevere un avviso di apertura di bandi per la richiesta di contributi;\n* ricevere un messaggio relativo all'emissione di un avviso di pagamento;\n* ricevere la conferma di documenti disponibili;\n* ricevere un avviso di pre-ruolo.\n",
  //             email: "segreteria@comune.montefiorino.mo.it",
  //             pec: "comune.montefiorino@pec.it",
  //             phone: "0536 962811",
  //             privacy_url:
  //               "https://www.comune.montefiorino.mo.it/footer/privacy",
  //             scope: "LOCAL",
  //             web_url: "https://portale-montefiorino.entranext.it/"
  //           },
  //           service_name:
  //             "Servizio Turismo-Sport-Associazionismo-Cultura-Scuola",
  //           version: 3
  //         }
  //       },
  //       "01EM1B5EX7RA6ER00KZYF7AEXG": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "Servizio Patrimonio Immobiliare",
  //           organization_fiscal_code: "00235880366",
  //           organization_name: "Comune di Sassuolo",
  //           service_id: "01EM1B5EX7RA6ER00KZYF7AEXG",
  //           service_metadata: {
  //             address: "Via Fenuzzi, 5 - 41049 - Sassuolo",
  //             description:
  //               "Il servizio informa il cittadino sull'andamento delle domande online e sullo stato delle posizioni debitorie. \nTramite IO potrai:\n\n* ricevere un avviso di apertura di bandi per la richiesta di contributi;\n* ricevere un messaggio relativo all'emissione di un avviso di pagamento;\n* ricevere la conferma di documenti disponibili;\n* ricevere un avviso di pre-ruolo.\n",
  //             email: "urp@comune.sassuolo.mo.it",
  //             pec: "comune.sassuolo@cert.comune.sassuolo.mo.it",
  //             phone: "0536 880801",
  //             privacy_url: "https://www.comune.sassuolo.mo.it/footer/privacy",
  //             scope: "LOCAL",
  //             web_url: "https://portale-sassuolo.entranext.it"
  //           },
  //           service_name: "Ufficio Casa",
  //           version: 5
  //         }
  //       },
  //       "01EM1B7JE2Z0PRNV23RVXTCEXC": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "Area Scolastica Sociale",
  //           organization_fiscal_code: "00262700362",
  //           organization_name: "Comune di Maranello",
  //           service_id: "01EM1B7JE2Z0PRNV23RVXTCEXC",
  //           service_metadata: {
  //             address: "Piazza Libertà, 33 - 41053 - Maranello",
  //             description:
  //               "Il servizio informa il cittadino sull'andamento delle domande online e sullo stato delle posizioni debitorie. \nTramite IO potrai:\n\n* ricevere un avviso di apertura delle iscrizioni ai servizi scolastici;\n* ricevere un avviso di apertura di bandi per la richiesta di contributi;\n* ricevere un messaggio relativo all'emissione di un avviso di pagamento;\n* ricevere la conferma di documenti disponibili;\n* ricevere un avviso di pre-ruolo.\n",
  //             email: "urp@comune.maranello.mo.it",
  //             pec: "comune.maranello@cert.comune.maranello.mo.it",
  //             phone: "0536 240000",
  //             privacy_url: "https://www.comune.maranello.mo.it/footer/privacy",
  //             scope: "LOCAL",
  //             web_url: "https://portale-maranello.entranext.it/"
  //           },
  //           service_name: "Servizio Istruzione",
  //           version: 4
  //         }
  //       },
  //       "01EM1B8DNCVJD7VXJ5SFPEQD44": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "Servizio Affari Generali",
  //           organization_fiscal_code: "84002170367",
  //           organization_name: "Comune di Frassinoro",
  //           service_id: "01EM1B8DNCVJD7VXJ5SFPEQD44",
  //           service_metadata: {
  //             address: "Piazza Miani, 16 - 41044 - Frassinoro",
  //             description:
  //               "Il servizio informa il cittadino sull'andamento delle domande online e sullo stato delle posizioni debitorie. \nTramite IO potrai:\n\n* ricevere un avviso di apertura delle iscrizioni ai servizi scolastici;\n* ricevere un avviso di apertura di bandi per la richiesta di contributi;\n* ricevere un messaggio relativo all'emissione di un avviso di pagamento;\n* ricevere la conferma di documenti disponibili;\n* ricevere un avviso di pre-ruolo.\n",
  //             email: "segreteria@comune.frassinoro.mo.it",
  //             pec: "comune.frassinoro@pec.it",
  //             phone: "0536 971811",
  //             privacy_url: "https://www.comune.frassinoro.mo.it/footer/privacy",
  //             scope: "LOCAL",
  //             web_url: "https://portale-frassinoro.entranext.it/"
  //           },
  //           service_name: "Servizio Scuola e Cultura",
  //           version: 3
  //         }
  //       },
  //       "01EM1B9G8HCK2TM3NTF9W0N5D9": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name:
  //             "1 - Amministrazione Generale e Servizi alla Città",
  //           organization_fiscal_code: "00603990367",
  //           organization_name: "Comune di Formigine",
  //           service_id: "01EM1B9G8HCK2TM3NTF9W0N5D9",
  //           service_metadata: {
  //             address: "Via Unità d'Italia, 26 - 41043 - Formigine",
  //             description:
  //               "Il servizio informa il cittadino sull'andamento delle domande online e sullo stato delle posizioni debitorie. \nTramite IO potrai:\n\n* ricevere un avviso di apertura delle iscrizioni ai servizi scolastici;\n* ricevere un avviso di apertura di bandi per la richiesta di contributi;\n* ricevere un messaggio relativo all'emissione di un avviso di pagamento;\n* ricevere la conferma di documenti disponibili;\n* ricevere un avviso di pre-ruolo.\n",
  //             email: "urp@comune.formigine.mo.it",
  //             pec: "comune.formigine@cert.comune.formigine.mo.it",
  //             phone: "059 416333",
  //             privacy_url: "https://www.comune.formigine.mo.it/footer/privacy",
  //             scope: "LOCAL",
  //             web_url: "https://portale-formigine.entranext.it/"
  //           },
  //           service_name: "Servizio Istruzione",
  //           version: 4
  //         }
  //       },
  //       "01EM1BAAY94S0B2XNFB615M1VW": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name:
  //             "Settore 2 - Servizi Economici - Finanziari ed Istruzione",
  //           organization_fiscal_code: "84001590367",
  //           organization_name: "Comune di Fiorano Modenese",
  //           service_id: "01EM1BAAY94S0B2XNFB615M1VW",
  //           service_metadata: {
  //             address: "Piazza Ciro Menotti, 1 - 41042 - Fiorano Modenese",
  //             description:
  //               "Il servizio informa il cittadino sull'andamento delle domande online e sullo stato delle posizioni debitorie. \nTramite IO potrai:\n\n* ricevere un avviso di apertura delle iscrizioni ai servizi scolastici;\n* ricevere un avviso di apertura di bandi per la richiesta di contributi;\n* ricevere un messaggio relativo all'emissione di un avviso di pagamento;\n* ricevere la conferma di documenti disponibili;\n* ricevere un avviso di pre-ruolo.\n",
  //             email: "info@comune.fiorano-modenese.mo.it",
  //             pec: "comunefiorano@cert.fiorano.it",
  //             phone: "0536 833111",
  //             privacy_url:
  //               "https://www.comune.fiorano-modenese.mo.it/footer/privacy",
  //             scope: "LOCAL",
  //             web_url: "https://portale-fiorano-modenese.entranext.it/"
  //           },
  //           service_name: "Servizio Istruzione",
  //           version: 4
  //         }
  //       },
  //       "01EM3Z9QAQWTWHFEV9JS5JCN0B": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "Servizi Comunali",
  //           organization_fiscal_code: "80007710264",
  //           organization_name: "Comune di Silea",
  //           service_id: "01EM3Z9QAQWTWHFEV9JS5JCN0B",
  //           service_metadata: {
  //             address: "Via Don Minzoni, 12 - 31057 Silea",
  //             description:
  //               "Il servizio di Pagamenti per i servizi cimiteriali offre la possibilità di gestire i pagamenti direttamente attraverso l'app IO, oltre alle modalità di pagamento già previste. \nTramite IO potrai ricevere avvisi per:\n\n* pagamento delle concessioni cimiteriali;\n* pagamento dei diritti cimiteriali;\n* pagamento dei servizi di cremazione.\n",
  //             email: "cimiteriali@comune.silea.tv.it",
  //             pec: "protocollo@comune.silea.legalmail.it",
  //             phone: "0422 365705",
  //             privacy_url:
  //               "https://www.comune.silea.tv.it/home/info/privacy.html",
  //             scope: "LOCAL",
  //             web_url: "https://silea.comune.plugandpay.it/"
  //           },
  //           service_name: "Servizi Cimiteriali",
  //           version: 4
  //         }
  //       },
  //       "01EM3ZD0HP8K222GV9S8JPC9C4": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "Servizi Comunali",
  //           organization_fiscal_code: "80007710264",
  //           organization_name: "Comune di Silea",
  //           service_id: "01EM3ZD0HP8K222GV9S8JPC9C4",
  //           service_metadata: {
  //             address: "Via Don Minzoni, 12 - 31057 Silea",
  //             description:
  //               "Il servizio di Pagamenti per uso immobili  offre la possibilità di gestire dei pagamenti direttamente attraverso l'app IO, oltre alle modalità di pagamento già previste. \nTramite IO potrai ricevere avvisi per:\n\n* pagamento utilizzo palestre;\n* pagamento utilizzo locali.\n",
  //             email: "servizipersona@comune.silea.tv .it",
  //             pec: "protocollo@comune.silea.legalmail.it",
  //             phone: "0422 365724",
  //             privacy_url:
  //               "https://www.comune.silea.tv.it/home/info/privacy.html",
  //             scope: "LOCAL",
  //             web_url: "https://silea.comune.plugandpay.it/"
  //           },
  //           service_name: "Uso Immobili",
  //           version: 4
  //         }
  //       },
  //       "01EM3ZE3W7PBBYGSH27TSFH2DR": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "Servizi Comunali",
  //           organization_fiscal_code: "80007710264",
  //           organization_name: "Comune di Silea",
  //           service_id: "01EM3ZE3W7PBBYGSH27TSFH2DR",
  //           service_metadata: {
  //             address: "Via Don Minzoni, 12 - 31057 Silea",
  //             description:
  //               "Il servizio di Pagamenti per i canoni e tributi  offre la possibilità di gestire dei pagamenti direttamente attraverso l'app IO, oltre alle modalità di pagamento già previste. \nTramite IO potrai ricevere avvisi per:\n\n* pagamento affitto fabbricati;\n* pagamento COSAP permanente e temporanea.\n",
  //             email: "suap@comune.silea.tv.it",
  //             pec: "protocollo@comune.silea.legalmail.it",
  //             phone: "0422 365705",
  //             privacy_url:
  //               "https://www.comune.silea.tv.it/home/info/privacy.html",
  //             scope: "LOCAL",
  //             web_url: "https://silea.comune.plugandpay.it/"
  //           },
  //           service_name: "Canoni e Tributi",
  //           version: 4
  //         }
  //       },
  //       "01EM3ZF5YGN6KGN77S0H50W865": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "Servizi Comunali",
  //           organization_fiscal_code: "80007710264",
  //           organization_name: "Comune di Silea",
  //           service_id: "01EM3ZF5YGN6KGN77S0H50W865",
  //           service_metadata: {
  //             address: "Via Don Minzoni, 12 - 31057 Silea",
  //             description:
  //               "Il servizio di Pagamenti per i servizi sociali  offre la possibilità di gestire dei pagamenti direttamente attraverso l'app IO, oltre alle modalità di pagamento già previste. \nTramite IO potrai ricevere avvisi per:\n\n* pagamento del servizio di assistenza;\n* pagamento dei pasti caldi a domicilio.\n",
  //             email: "servizipersona@comune.silea.tv .it",
  //             pec: "protocollo@comune.silea.legalmail.it",
  //             phone: "0422 365729",
  //             privacy_url:
  //               "https://www.comune.silea.tv.it/home/info/privacy.html",
  //             scope: "LOCAL",
  //             web_url: "https://silea.comune.plugandpay.it/"
  //           },
  //           service_name: "Servizi Sociali",
  //           version: 4
  //         }
  //       },
  //       "01EM3ZGA1C6KVT7M66W4XPRA42": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "Servizi Comunali",
  //           organization_fiscal_code: "80007710264",
  //           organization_name: "Comune di Silea",
  //           service_id: "01EM3ZGA1C6KVT7M66W4XPRA42",
  //           service_metadata: {
  //             address: "Via Don Minzoni, 12 - 31057 Silea",
  //             description:
  //               "Il servizio di Pagamenti per i servizi edilizia offre la possibilità di gestire dei pagamenti direttamente attraverso l'app IO, oltre alle modalità di pagamento già previste. \nTramite IO potrai ricevere avvisi per:\n\n* pagamento del contributo di costruzione;\n* pagamento dei diritti pratiche edilizie;\n* pagamento per striscioni ed impianti pubblicitari.\n",
  //             email: "urbanistica@comune.silea.tv.it",
  //             pec: "protocollo@comune.silea.legalmail.it",
  //             phone: "0422 365722",
  //             privacy_url:
  //               "https://www.comune.silea.tv.it/home/info/privacy.html",
  //             scope: "LOCAL",
  //             web_url: "https://silea.comune.plugandpay.it/"
  //           },
  //           service_name: "Edilizia",
  //           version: 5
  //         }
  //       },
  //       "01EM3ZH9NSXSCZW5ZC267H69S0": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "Servizi Comunali",
  //           organization_fiscal_code: "80007710264",
  //           organization_name: "Comune di Silea",
  //           service_id: "01EM3ZH9NSXSCZW5ZC267H69S0",
  //           service_metadata: {
  //             address: "Via Don Minzoni, 12 - 31057 Silea",
  //             description:
  //               "Il servizio di Pagamenti per i servizi anagrafe offre la possibilità di gestire dei pagamenti direttamente attraverso l'app IO, oltre alle modalità di pagamento già previste. \nTramite IO potrai ricevere avvisi per:\n\n* pagamento del rimborso spese per celebrazione matrimoni e unioni civili.\n",
  //             email: "anagrafe@comune.silea.tv.it",
  //             pec: "protocollo@comune.silea.legalmail.it",
  //             phone: "0422 365727",
  //             privacy_url:
  //               "https://www.comune.silea.tv.it/home/info/privacy.html",
  //             scope: "LOCAL",
  //             web_url: "https://silea.comune.plugandpay.it/"
  //           },
  //           service_name: "Anagrafe",
  //           version: 5
  //         }
  //       },
  //       "01EMGGTMA3N4794RMN751BVY7B": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "Area Istruzione",
  //           organization_fiscal_code: "00031500945",
  //           organization_name: "Comune di Colli a Volturno",
  //           service_id: "01EMGGTMA3N4794RMN751BVY7B",
  //           service_metadata: {
  //             address: "Piazza Municipio, n.1 - 1° Piano",
  //             description:
  //               "Il Servizio Refezione Scolastica si occupa della gestione della mensa scolastica. \nTramite IO potrai:\n\n* ricevere un promemoria alla scadenza dell'iscrizione al servizio Refezione Scolastica;\n* ricevere un promemoria alla scadenza dei Buoni Pasto.\n",
  //             email: "protocollo@comune.colliavolturno.is.it",
  //             pec: "colliavolturno@pec.it",
  //             phone: "0865 957901",
  //             privacy_url:
  //               "https://www.comune.colliavolturno.is.it/new/amministrazione/documentation/privacy-policy.html",
  //             scope: "LOCAL",
  //             web_url:
  //               "http://cloud.urbi.it/urbi/progs/urp/solhome.sto?DB_NAME=n201351&areaAttiva=7"
  //           },
  //           service_name: "Refezione Scolastica",
  //           version: 5
  //         }
  //       },
  //       "01EMGGV2YMEMVFGC7ED2385FJB": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "Area Anagrafe",
  //           organization_fiscal_code: "00031500945",
  //           organization_name: "Comune di Colli a Volturno",
  //           service_id: "01EMGGV2YMEMVFGC7ED2385FJB",
  //           service_metadata: {
  //             address: "Piazza Municipio, n.1 - 1° Piano",
  //             description:
  //               "Il Servizio di Anagrafe offre la possibilità di gestire i propri dati anagrafici, documenti in scadenza e dichiarazioni.\nTramite IO potrai:\n\n* essere informato sulla scadenza della tua carta d'identità;\n* ricevere un avviso che ti ricorda che il permesso di soggiorno risulta scaduto da alemno 6 mesi e che devi esibire il nuovo permesso in anagrafe;\n* ricevere un promemoria alla scadenza dell'iscrizione al servizio Refezione Scolastica;\n* ricevere un promemoria alla scadenza dei Buoni Pasto.\n",
  //             email: "protocollo@comune.colliavolturno.is.it",
  //             pec: "colliavolturno@pec.it",
  //             phone: "0865 957901",
  //             privacy_url:
  //               "https://www.comune.colliavolturno.is.it/new/amministrazione/documentation/privacy-policy.html",
  //             scope: "LOCAL",
  //             web_url:
  //               "http://cloud.urbi.it/urbi/progs/urp/solhome.sto?DB_NAME=n201351&areaAttiva=6"
  //           },
  //           service_name: "Anagrafe",
  //           version: 5
  //         }
  //       },
  //       "01EMGGVCRVS672MQGPJ32YYM7R": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "Area Tributi",
  //           organization_fiscal_code: "00031500945",
  //           organization_name: "Comune di Colli a Volturno",
  //           service_id: "01EMGGVCRVS672MQGPJ32YYM7R",
  //           service_metadata: {
  //             address: "Piazza Municipio, n.1 - 1° Piano",
  //             description:
  //               "Il Servizio Tributi si occupa della gestione delle scadenze dei vari pagamenti. \nTramite IO potrai:\n\n* ricevere un promemoria  che ti avvisa della scadenza di pagamento della TARI, IMU, TOSAP;\n* ricevere l'avviso di accertamento per il mancato pagamento di rate scadute, e pagare il relativo importo.\n",
  //             email: "protocollo@comune.colliavolturno.is.it",
  //             pec: "colliavolturno@pec.it",
  //             phone: "0865 957901",
  //             privacy_url:
  //               "https://www.comune.colliavolturno.is.it/new/amministrazione/documentation/privacy-policy.html",
  //             scope: "LOCAL",
  //             web_url:
  //               "http://cloud.urbi.it/urbi/progs/urp/solhome.sto?DB_NAME=n201351&areaAttiva=4"
  //           },
  //           service_name: "Tributi",
  //           version: 5
  //         }
  //       },
  //       "01EMGGVX6SS8AG70B8E72X4XCM": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "Area Cimiteri",
  //           organization_fiscal_code: "00031500945",
  //           organization_name: "Comune di Colli a Volturno",
  //           service_id: "01EMGGVX6SS8AG70B8E72X4XCM",
  //           service_metadata: {
  //             address: "Piazza Municipio, n.1 - 1° Piano",
  //             description:
  //               "Il Servizio Cimiteri si occupa della riscossione dei canoni della Luce votiva e delle spese condominiali dei loculi. Tramite IO potrai:\n\n* ricevere un promemoria che ti avvisa della scadenza di pagamento dei canoni;\n* ricevere l'avviso di acertamento per il mancato pagamento dei canoni, e pagare il relativo importo.\n",
  //             email: "protocollo@comune.colliavolturno.is.it",
  //             pec: "colliavolturno@pec.it",
  //             phone: "0865 957901",
  //             privacy_url:
  //               "https://www.comune.colliavolturno.is.it/new/amministrazione/documentation/privacy-policy.html",
  //             scope: "LOCAL",
  //             web_url:
  //               "http://cloud.urbi.it/urbi/progs/urp/solhome.sto?DB_NAME=n201351&areaAttiva=9"
  //           },
  //           service_name: "Cimiteri",
  //           version: 5
  //         }
  //       },
  //       "01EMGGW8P485YCE80K0KCX8A8B": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "Servizi al Cittadino",
  //           organization_fiscal_code: "00031500945",
  //           organization_name: "Comune di Colli a Volturno",
  //           service_id: "01EMGGW8P485YCE80K0KCX8A8B",
  //           service_metadata: {
  //             address: "Piazza Municipio, n.1 - 1° Piano",
  //             description:
  //               "Sportello Facile è un servizio on-line che consente a tutti i cittadini di effettuare delle prenotazioni di appuntamento presso diversi sportelli. \nTramite IO potrai:\n\n* ricevere un promemoria che ti ricorda data e orario di un appuntamento prenotato presso un ufficio comunale;\n* essere notificato in caso di modifica o disdetta dell'appuntamento.\n",
  //             email: "protocollo@comune.colliavolturno.is.it",
  //             pec: "colliavolturno@pec.it",
  //             phone: "0865 957901",
  //             privacy_url:
  //               "https://www.comune.colliavolturno.is.it/new/amministrazione/documentation/privacy-policy.html",
  //             scope: "LOCAL",
  //             web_url:
  //               "http://cloud.urbi.it/urbi/progs/urp/solhome.sto?DB_NAME=n201351&areaAttiva=1"
  //           },
  //           service_name: "Sportello Facile",
  //           version: 6
  //         }
  //       },
  //       "01EMNQDSTD9F3WEFQYA5WWWHZY": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "Gestione PRA",
  //           organization_fiscal_code: "00907501001",
  //           organization_name: "ACI",
  //           service_id: "01EMNQDSTD9F3WEFQYA5WWWHZY",
  //           service_metadata: {
  //             address: "ACI - Sede Legale - Via Marsala 8, 00185 Roma",
  //             description:
  //               "Il servizio di gestione PRA dell'ACI si occupa della gestione del Pubblico Registro Automobilistico.\nTramite IO potrai:\n\n* ricevere una notifica quando viene trascritto al PRA un evento su un veicolo a te intestato a seguito di pratiche  presentate da te stesso o su richiesta di altri soggetti.\n\nAd esempio saranno inviate comunicazioni relativamente alle seguenti tipologie di registrazioni al PRA:\n  \n* iscrizione/cancellazione del fermo amministrativo da parte di un Agente della riscossione;\n* radiazione per la demolizione o  per definitiva esportazione all'estero;\n* passaggio di proprietà al nuovo acquirente;\n* perdita/rientro in possesso del veicolo.\n",
  //             phone: "800 18 34 34",
  //             privacy_url:
  //               "http://www.aci.it/per-la-navigazione-del-sito/privacy-policy.html",
  //             scope: "NATIONAL",
  //             web_url:
  //               "http://www.aci.it/i-servizi/servizi-online/avvisaci.html"
  //           },
  //           service_name: "AvvisACI",
  //           version: 4
  //         }
  //       },
  //       "01EN7PNQN9R09B0YVK12Y5MCGC": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "Settore 1 - Tributi Comunali",
  //           organization_fiscal_code: "84004890830",
  //           organization_name: "Comune di Tortorici",
  //           service_id: "01EN7PNQN9R09B0YVK12Y5MCGC",
  //           service_metadata: {
  //             address: "Viale Rosario Livatino - 98078 Tortorici (ME)",
  //             description:
  //               "Il Servizio Idrico Integrato permette di gestire i relativi pagamenti e comunicazioni. \nTramite IO potrai:\n\n- essere avvisato in prossimità della scadenza del canone, e procedere al pagamento;\n- ricevere comunicazioni inerenti al servizio.",
  //             pec: "comune.tortorici@pec.tortorici.eu",
  //             phone: "0941 4231223",
  //             privacy_url: "https://www.tortorici.gov.it/privacy-policy/",
  //             scope: "LOCAL",
  //             tos_url: "https://www.tortorici.gov.it/note-legali/",
  //             web_url: "http://sportellotel.servizienti.it/tortorici/"
  //           },
  //           service_name: "Servizio Idrico Integrato",
  //           version: 3
  //         }
  //       },
  //       "azure-deployc49a": {
  //         kind: "PotSome",
  //         value: {
  //           available_notification_channels: ["EMAIL", "WEBHOOK"],
  //           department_name: "Progetto IO",
  //           organization_fiscal_code: "15376371009",
  //           organization_name: "IO - L'app dei servizi pubblici",
  //           service_id: "azure-deployc49a",
  //           service_metadata: {
  //             description:
  //               "IO è l’applicazione sperimentale (attualmente in fase di open beta) che permette ai cittadini\ndi gestire direttamente dal proprio smartphone i rapporti con la Pubblica Amministrazione Italiana\ne l’accesso ai servizi pubblici.\n\nTi invierà messaggi su come usare l'applicazione, aggiornamenti sul progetto o sulle funzionalità dell'app,\nrichieste di feedback e altre istruzioni utili alla sperimentazione.\n\nIO è un progetto della Presidenza del Consiglio dei Ministri, iniziato dal Team per la Trasformazione Digitale\nin collaborazione con Agid nel 2018, e attualmente erogato e gestito dalla società PagoPA S.p.a.\n",
  //             scope: "NATIONAL",
  //             web_url: "https://io.italia.it"
  //           },
  //           service_name: "Novità e aggiornamenti",
  //           version: 4
  //         }
  //       }
  //     },
  //     byOrgFiscalCode: {
  //       "00514490010": [
  //         "01D4AQHBKESFSX98TK52PMD5S3",
  //         "01D4AQHCWWH2366GDBHV6MXDVT",
  //         "01D4AQHE0R5DRJJ9635WSK7GZE",
  //         "01D9VYPJ9S41QCD3E6XE3K6D1N"
  //       ],
  //       "01199250158": [
  //         "01D5RQM2NVWM2QVZPQQ4FC8Z2E",
  //         "01D72312AZT81N4JC3GV6980CK",
  //         "01D5ECFA96C6HYNPXVC6P55D1S"
  //       ],
  //       "09000640012": ["01D81BTR75QGVVCC2ASSSZNSNV"],
  //       "80010170266": ["01D88CM09S0SB72B7AN92XGKPC"],
  //       "03334231200": [
  //         "01DBAW7AY7RP4E3EMST2X21K3W",
  //         "01DBCRDSXAT2CP73KVFHFSXD0P",
  //         "01DBCRF8455F7NE9QE8TPEJVRV",
  //         "01DNEZT8BC7MFM96Q4J0MS72E2",
  //         "01EDE62JTDFATVRYV0CGBPNXX2",
  //         "01EDE5Z3RHY0G67Y29WZF11J6G"
  //       ],
  //       "00907501001": [
  //         "01DBJNFSJYB53TP0AZNA8FQGJJ",
  //         "01DBJNYDCT0Q5G0D0K7RFS2R2F",
  //         "01EMNQDSTD9F3WEFQYA5WWWHZY"
  //       ],
  //       "00493410583": ["01DBJNW5NR2M2VQTM7VG0SGNNZ"],
  //       "00301970190": [
  //         "01DCER0ANWQF5908X5YX3NKJD0",
  //         "01DCER0VWBJVY6K6YXK1XM54C9",
  //         "01DCER17X2DG6DBD7ZMN1Z95H7",
  //         "01DEYQGXBN1XB9W6RDZV94V20A"
  //       ],
  //       "80016350821": [
  //         "01DPB2JK990ASH9C6B14Q43SH4",
  //         "01DMNDFTJ4MGBW9CXA3Y5N91W4"
  //       ],
  //       "00792720153": [
  //         "01DVQZ21YD356PH8V5G1S5KMN3",
  //         "01DVQZ2G99HQ0GW27MSD1ECC9P"
  //       ],
  //       "02438750586": [
  //         "01E1YAB4X63WG8BPBVR43KH3J1",
  //         "01E2E0E80Z4TR72V43XVZGX4KF"
  //       ],
  //       "90001310631": ["01E219K9CX4BHFJTGE868HPJ59"],
  //       "00168090348": ["01E2XCR1N4VNMG18XJ5BD4BV9Y"],
  //       "00442530341": ["01E36YVB7NDWK7FFF6DBNVDZTP"],
  //       "92170530346": ["01E36YY11TMJAC7W9FH0ETF3QZ"],
  //       "00257850396": ["01E4WV19MWPYYFMBTVAZSAGWPC"],
  //       "00202030342": ["01E4XD5N8F4XH9ARGV3SAXMZT0"],
  //       "00441550357": ["01E6C1NPEK6475G10YRJ139JJG"],
  //       "00220040349": ["01E6TTG0VG6DFVFMCEZJQDDM39"],
  //       "00304260409": ["01E7MGBS956ADAH12N65TQZ83A"],
  //       "00145920351": [
  //         "01E8PWHM514G7YP06WPDMGH0V5",
  //         "01E9FQBB51N80EJ79Y1RFQC2XD"
  //       ],
  //       "00297960197": ["01E983KMACRZ0MTWEKP6TVC0W6"],
  //       "84002330540": [
  //         "01E9Z5M0N9FK3AQYXPZ4F0CKR9",
  //         "01E9Z5V0EK8HS8KZV0CB12421Z"
  //       ],
  //       "00192320117": [
  //         "01EA1RD59JJPWY254P0FRT3VHC",
  //         "01EA1R4S59VG36BPB7SDQXQKNN"
  //       ],
  //       "80016750483": [
  //         "01EAC1S4YXN04WC6GZJ2HX9651",
  //         "01EAC1VBNAQ30AF1C0H8JTFGXN"
  //       ],
  //       "06363391001": ["01EB8AXKNV6NMSP2R25KSGF743"],
  //       "80005450616": [
  //         "01ECMDBNECKX2FQATF37TQNSYQ",
  //         "01ECMDCWM0CAC98HZS7WHJZQQ1",
  //         "01EHY17SEV6YYG6Z1CSAQGM8MC",
  //         "01EHY18EHZEDCTEHNF3T6RP49F",
  //         "01EHY18TQYNE7S325G7TEKF322"
  //       ],
  //       "00117380733": [
  //         "01ED912D869F64PZCPR1XQR61E",
  //         "01EHC02SVSKQ2M97DDSY3HAJWN",
  //         "01EHC0FY33PQFJXWQJ99K108J8",
  //         "01EHC0HHDCT3WK0G04SFBMT44E"
  //       ],
  //       "00259810232": [
  //         "01EDVBSFKB1WHWHJW915SYER7F",
  //         "01EDVC0034TXCADN1XFY4375VS",
  //         "01EDVC3RWMJV1NT9YH4J141B9S"
  //       ],
  //       "80034870636": [
  //         "01EDY252DS9HTNNHRJ83PRXAVA",
  //         "01EDY3N93S3WR6ZTP5G1WZ9YG9"
  //       ],
  //       "00246880397": ["01EHC41R5RKPCZCEPNF8A8XWWN"],
  //       "06432250485": ["01EHSJ7H1KEE33PMJTMP670Z35"],
  //       "81001470616": ["01EEA5C29SJEE918D2AE1SH68H"],
  //       "83000710265": [
  //         "01EHWBMQ91QPTWECS5AW8W6W5P",
  //         "01EHWBSWXBJ3ZW7BABKG8Y5TMB"
  //       ],
  //       "87007530170": [
  //         "01EK0738Y1HDNXFHRQZ54SQSK7",
  //         "01EKAKNKAW7YY57P09ZT0BT3ND",
  //         "01EKAMCZ8592P034H91Y8MV7R5"
  //       ],
  //       "00623530136": ["01EJXN09K6WA7QQPQ7YG5HA4XP"],
  //       "00235880366": [
  //         "01EM1AWDX0X4MWQW7D2FJHTC72",
  //         "01EM1B5EX7RA6ER00KZYF7AEXG"
  //       ],
  //       "84002010365": ["01EM1AYAV7Z5J41ZNNH7RSEQ5F"],
  //       "00415030360": ["01EM1AZXRQ1PA5XKHHBN18W5C6"],
  //       "00495090367": ["01EM1B35MHJG5G47QPS0KE0KAR"],
  //       "00262700362": ["01EM1B7JE2Z0PRNV23RVXTCEXC"],
  //       "84002170367": ["01EM1B8DNCVJD7VXJ5SFPEQD44"],
  //       "00603990367": ["01EM1B9G8HCK2TM3NTF9W0N5D9"],
  //       "84001590367": ["01EM1BAAY94S0B2XNFB615M1VW"],
  //       "80007710264": [
  //         "01EM3Z9QAQWTWHFEV9JS5JCN0B",
  //         "01EM3ZF5YGN6KGN77S0H50W865",
  //         "01EM3ZD0HP8K222GV9S8JPC9C4",
  //         "01EM3ZE3W7PBBYGSH27TSFH2DR",
  //         "01EM3ZGA1C6KVT7M66W4XPRA42",
  //         "01EM3ZH9NSXSCZW5ZC267H69S0"
  //       ],
  //       "00031500945": [
  //         "01EMGGTMA3N4794RMN751BVY7B",
  //         "01EMGGV2YMEMVFGC7ED2385FJB",
  //         "01EMGGVCRVS672MQGPJ32YYM7R",
  //         "01EMGGW8P485YCE80K0KCX8A8B",
  //         "01EMGGVX6SS8AG70B8E72X4XCM"
  //       ],
  //       "15376371009": ["azure-deployc49a"],
  //       "84004890830": ["01EN7PNQN9R09B0YVK12Y5MCGC"]
  //     },
  //     visible: {
  //       kind: "PotSome",
  //       value: [
  //         {
  //           scope: "LOCAL",
  //           service_id: "01D4AQHBKESFSX98TK52PMD5S3",
  //           version: 13
  //         },
  //         {
  //           scope: "LOCAL",
  //           service_id: "01D4AQHCWWH2366GDBHV6MXDVT",
  //           version: 10
  //         },
  //         {
  //           scope: "LOCAL",
  //           service_id: "01D4AQHE0R5DRJJ9635WSK7GZE",
  //           version: 10
  //         },
  //         {
  //           scope: "LOCAL",
  //           service_id: "01D5ECFA96C6HYNPXVC6P55D1S",
  //           version: 42
  //         },
  //         {
  //           scope: "LOCAL",
  //           service_id: "01D5RQM2NVWM2QVZPQQ4FC8Z2E",
  //           version: 12
  //         },
  //         {
  //           scope: "LOCAL",
  //           service_id: "01D72312AZT81N4JC3GV6980CK",
  //           version: 10
  //         },
  //         {
  //           scope: "LOCAL",
  //           service_id: "01D81BTR75QGVVCC2ASSSZNSNV",
  //           version: 12
  //         },
  //         {
  //           scope: "LOCAL",
  //           service_id: "01D88CM09S0SB72B7AN92XGKPC",
  //           version: 12
  //         },
  //         {
  //           scope: "LOCAL",
  //           service_id: "01D9VYPJ9S41QCD3E6XE3K6D1N",
  //           version: 11
  //         },
  //         {
  //           scope: "LOCAL",
  //           service_id: "01DBAW7AY7RP4E3EMST2X21K3W",
  //           version: 5
  //         },
  //         {
  //           scope: "LOCAL",
  //           service_id: "01DBCRDSXAT2CP73KVFHFSXD0P",
  //           version: 7
  //         },
  //         {
  //           scope: "LOCAL",
  //           service_id: "01DBCRF8455F7NE9QE8TPEJVRV",
  //           version: 7
  //         },
  //         {
  //           scope: "NATIONAL",
  //           service_id: "01DBJNFSJYB53TP0AZNA8FQGJJ",
  //           version: 19
  //         },
  //         {
  //           scope: "NATIONAL",
  //           service_id: "01DBJNW5NR2M2VQTM7VG0SGNNZ",
  //           version: 5
  //         },
  //         {
  //           scope: "NATIONAL",
  //           service_id: "01DBJNYDCT0Q5G0D0K7RFS2R2F",
  //           version: 6
  //         },
  //         {
  //           scope: "LOCAL",
  //           service_id: "01DCER0ANWQF5908X5YX3NKJD0",
  //           version: 5
  //         },
  //         {
  //           scope: "LOCAL",
  //           service_id: "01DCER0VWBJVY6K6YXK1XM54C9",
  //           version: 6
  //         },
  //         {
  //           scope: "LOCAL",
  //           service_id: "01DCER17X2DG6DBD7ZMN1Z95H7",
  //           version: 6
  //         },
  //         {
  //           scope: "LOCAL",
  //           service_id: "01DEYQGXBN1XB9W6RDZV94V20A",
  //           version: 39
  //         },
  //         {
  //           scope: "LOCAL",
  //           service_id: "01DMNDFTJ4MGBW9CXA3Y5N91W4",
  //           version: 7
  //         },
  //         {
  //           scope: "LOCAL",
  //           service_id: "01DNEZT8BC7MFM96Q4J0MS72E2",
  //           version: 13
  //         },
  //         {
  //           scope: "LOCAL",
  //           service_id: "01DPB2JK990ASH9C6B14Q43SH4",
  //           version: 6
  //         },
  //         {
  //           scope: "LOCAL",
  //           service_id: "01DVQZ21YD356PH8V5G1S5KMN3",
  //           version: 10
  //         },
  //         {
  //           scope: "LOCAL",
  //           service_id: "01DVQZ2G99HQ0GW27MSD1ECC9P",
  //           version: 9
  //         },
  //         {
  //           scope: "LOCAL",
  //           service_id: "01E1YAB4X63WG8BPBVR43KH3J1",
  //           version: 8
  //         },
  //         {
  //           scope: "LOCAL",
  //           service_id: "01E219K9CX4BHFJTGE868HPJ59",
  //           version: 8
  //         },
  //         {
  //           scope: "LOCAL",
  //           service_id: "01E2E0E80Z4TR72V43XVZGX4KF",
  //           version: 7
  //         },
  //         {
  //           scope: "LOCAL",
  //           service_id: "01E2XCR1N4VNMG18XJ5BD4BV9Y",
  //           version: 12
  //         },
  //         {
  //           scope: "LOCAL",
  //           service_id: "01E36YVB7NDWK7FFF6DBNVDZTP",
  //           version: 7
  //         },
  //         {
  //           scope: "LOCAL",
  //           service_id: "01E36YY11TMJAC7W9FH0ETF3QZ",
  //           version: 9
  //         },
  //         {
  //           scope: "LOCAL",
  //           service_id: "01E4WV19MWPYYFMBTVAZSAGWPC",
  //           version: 9
  //         },
  //         {
  //           scope: "LOCAL",
  //           service_id: "01E4XD5N8F4XH9ARGV3SAXMZT0",
  //           version: 6
  //         },
  //         {
  //           scope: "LOCAL",
  //           service_id: "01E6C1NPEK6475G10YRJ139JJG",
  //           version: 11
  //         },
  //         {
  //           scope: "LOCAL",
  //           service_id: "01E6TTG0VG6DFVFMCEZJQDDM39",
  //           version: 6
  //         },
  //         {
  //           scope: "LOCAL",
  //           service_id: "01E7MGBS956ADAH12N65TQZ83A",
  //           version: 4
  //         },
  //         {
  //           scope: "LOCAL",
  //           service_id: "01E8PWHM514G7YP06WPDMGH0V5",
  //           version: 8
  //         },
  //         {
  //           scope: "LOCAL",
  //           service_id: "01E983KMACRZ0MTWEKP6TVC0W6",
  //           version: 10
  //         },
  //         {
  //           scope: "LOCAL",
  //           service_id: "01E9FQBB51N80EJ79Y1RFQC2XD",
  //           version: 6
  //         },
  //         {
  //           scope: "LOCAL",
  //           service_id: "01E9Z5M0N9FK3AQYXPZ4F0CKR9",
  //           version: 5
  //         },
  //         {
  //           scope: "LOCAL",
  //           service_id: "01E9Z5V0EK8HS8KZV0CB12421Z",
  //           version: 6
  //         },
  //         {
  //           scope: "LOCAL",
  //           service_id: "01EA1R4S59VG36BPB7SDQXQKNN",
  //           version: 5
  //         },
  //         {
  //           scope: "LOCAL",
  //           service_id: "01EA1RD59JJPWY254P0FRT3VHC",
  //           version: 6
  //         },
  //         {
  //           scope: "LOCAL",
  //           service_id: "01EAC1S4YXN04WC6GZJ2HX9651",
  //           version: 9
  //         },
  //         {
  //           scope: "LOCAL",
  //           service_id: "01EAC1VBNAQ30AF1C0H8JTFGXN",
  //           version: 6
  //         },
  //         {
  //           scope: "NATIONAL",
  //           service_id: "01EB8AXKNV6NMSP2R25KSGF743",
  //           version: 4
  //         },
  //         {
  //           scope: "LOCAL",
  //           service_id: "01ECMDBNECKX2FQATF37TQNSYQ",
  //           version: 12
  //         },
  //         {
  //           scope: "LOCAL",
  //           service_id: "01ECMDCWM0CAC98HZS7WHJZQQ1",
  //           version: 8
  //         },
  //         {
  //           scope: "LOCAL",
  //           service_id: "01ED912D869F64PZCPR1XQR61E",
  //           version: 7
  //         },
  //         {
  //           scope: "LOCAL",
  //           service_id: "01EDE5Z3RHY0G67Y29WZF11J6G",
  //           version: 4
  //         },
  //         {
  //           scope: "LOCAL",
  //           service_id: "01EDE62JTDFATVRYV0CGBPNXX2",
  //           version: 4
  //         },
  //         {
  //           scope: "LOCAL",
  //           service_id: "01EDVBSFKB1WHWHJW915SYER7F",
  //           version: 5
  //         },
  //         {
  //           scope: "LOCAL",
  //           service_id: "01EDVC0034TXCADN1XFY4375VS",
  //           version: 5
  //         },
  //         {
  //           scope: "LOCAL",
  //           service_id: "01EDVC3RWMJV1NT9YH4J141B9S",
  //           version: 5
  //         },
  //         {
  //           scope: "LOCAL",
  //           service_id: "01EDY252DS9HTNNHRJ83PRXAVA",
  //           version: 13
  //         },
  //         {
  //           scope: "LOCAL",
  //           service_id: "01EDY3N93S3WR6ZTP5G1WZ9YG9",
  //           version: 9
  //         },
  //         {
  //           scope: "LOCAL",
  //           service_id: "01EEA5C29SJEE918D2AE1SH68H",
  //           version: 9
  //         },
  //         {
  //           scope: "LOCAL",
  //           service_id: "01EHC02SVSKQ2M97DDSY3HAJWN",
  //           version: 5
  //         },
  //         {
  //           scope: "LOCAL",
  //           service_id: "01EHC0FY33PQFJXWQJ99K108J8",
  //           version: 4
  //         },
  //         {
  //           scope: "LOCAL",
  //           service_id: "01EHC0HHDCT3WK0G04SFBMT44E",
  //           version: 5
  //         },
  //         {
  //           scope: "LOCAL",
  //           service_id: "01EHC41R5RKPCZCEPNF8A8XWWN",
  //           version: 5
  //         },
  //         {
  //           scope: "LOCAL",
  //           service_id: "01EHSJ7H1KEE33PMJTMP670Z35",
  //           version: 6
  //         },
  //         {
  //           scope: "LOCAL",
  //           service_id: "01EHWBMQ91QPTWECS5AW8W6W5P",
  //           version: 6
  //         },
  //         {
  //           scope: "LOCAL",
  //           service_id: "01EHWBSWXBJ3ZW7BABKG8Y5TMB",
  //           version: 5
  //         },
  //         {
  //           scope: "LOCAL",
  //           service_id: "01EHY17SEV6YYG6Z1CSAQGM8MC",
  //           version: 4
  //         },
  //         {
  //           scope: "LOCAL",
  //           service_id: "01EHY18EHZEDCTEHNF3T6RP49F",
  //           version: 5
  //         },
  //         {
  //           scope: "LOCAL",
  //           service_id: "01EHY18TQYNE7S325G7TEKF322",
  //           version: 4
  //         },
  //         {
  //           scope: "LOCAL",
  //           service_id: "01EJXN09K6WA7QQPQ7YG5HA4XP",
  //           version: 25
  //         },
  //         {
  //           scope: "LOCAL",
  //           service_id: "01EK0738Y1HDNXFHRQZ54SQSK7",
  //           version: 9
  //         },
  //         {
  //           scope: "LOCAL",
  //           service_id: "01EKAKNKAW7YY57P09ZT0BT3ND",
  //           version: 10
  //         },
  //         {
  //           scope: "LOCAL",
  //           service_id: "01EKAMCZ8592P034H91Y8MV7R5",
  //           version: 7
  //         },
  //         {
  //           scope: "LOCAL",
  //           service_id: "01EM1AWDX0X4MWQW7D2FJHTC72",
  //           version: 3
  //         },
  //         {
  //           scope: "LOCAL",
  //           service_id: "01EM1AYAV7Z5J41ZNNH7RSEQ5F",
  //           version: 5
  //         },
  //         {
  //           scope: "LOCAL",
  //           service_id: "01EM1AZXRQ1PA5XKHHBN18W5C6",
  //           version: 4
  //         },
  //         {
  //           scope: "LOCAL",
  //           service_id: "01EM1B35MHJG5G47QPS0KE0KAR",
  //           version: 3
  //         },
  //         {
  //           scope: "LOCAL",
  //           service_id: "01EM1B5EX7RA6ER00KZYF7AEXG",
  //           version: 5
  //         },
  //         {
  //           scope: "LOCAL",
  //           service_id: "01EM1B7JE2Z0PRNV23RVXTCEXC",
  //           version: 4
  //         },
  //         {
  //           scope: "LOCAL",
  //           service_id: "01EM1B8DNCVJD7VXJ5SFPEQD44",
  //           version: 3
  //         },
  //         {
  //           scope: "LOCAL",
  //           service_id: "01EM1B9G8HCK2TM3NTF9W0N5D9",
  //           version: 4
  //         },
  //         {
  //           scope: "LOCAL",
  //           service_id: "01EM1BAAY94S0B2XNFB615M1VW",
  //           version: 4
  //         },
  //         {
  //           scope: "LOCAL",
  //           service_id: "01EM3Z9QAQWTWHFEV9JS5JCN0B",
  //           version: 4
  //         },
  //         {
  //           scope: "LOCAL",
  //           service_id: "01EM3ZD0HP8K222GV9S8JPC9C4",
  //           version: 4
  //         },
  //         {
  //           scope: "LOCAL",
  //           service_id: "01EM3ZE3W7PBBYGSH27TSFH2DR",
  //           version: 4
  //         },
  //         {
  //           scope: "LOCAL",
  //           service_id: "01EM3ZF5YGN6KGN77S0H50W865",
  //           version: 4
  //         },
  //         {
  //           scope: "LOCAL",
  //           service_id: "01EM3ZGA1C6KVT7M66W4XPRA42",
  //           version: 5
  //         },
  //         {
  //           scope: "LOCAL",
  //           service_id: "01EM3ZH9NSXSCZW5ZC267H69S0",
  //           version: 5
  //         },
  //         {
  //           scope: "LOCAL",
  //           service_id: "01EMGGTMA3N4794RMN751BVY7B",
  //           version: 5
  //         },
  //         {
  //           scope: "LOCAL",
  //           service_id: "01EMGGV2YMEMVFGC7ED2385FJB",
  //           version: 5
  //         },
  //         {
  //           scope: "LOCAL",
  //           service_id: "01EMGGVCRVS672MQGPJ32YYM7R",
  //           version: 5
  //         },
  //         {
  //           scope: "LOCAL",
  //           service_id: "01EMGGVX6SS8AG70B8E72X4XCM",
  //           version: 5
  //         },
  //         {
  //           scope: "LOCAL",
  //           service_id: "01EMGGW8P485YCE80K0KCX8A8B",
  //           version: 6
  //         },
  //         {
  //           scope: "NATIONAL",
  //           service_id: "01EMNQDSTD9F3WEFQYA5WWWHZY",
  //           version: 4
  //         },
  //         {
  //           scope: "LOCAL",
  //           service_id: "01EN7PNQN9R09B0YVK12Y5MCGC",
  //           version: 3
  //         },
  //         { scope: "NATIONAL", service_id: "azure-deployc49a", version: 4 }
  //       ]
  //     },
  //     readState: {},
  //     firstLoading: { isFirstServicesLoadingCompleted: true }
  //   },
  //   organizations: {
  //     all: [
  //       { name: "Città di Torino", fiscalCode: "00514490010" },
  //       { name: "Comune di Milano", fiscalCode: "01199250158" },
  //       { name: "Città di Torino", fiscalCode: "09000640012" },
  //       { name: "Comune di Preganziol", fiscalCode: "80010170266" },
  //       { name: "Comune Valsamoggia", fiscalCode: "03334231200" },
  //       { name: "ACI", fiscalCode: "00493410583" },
  //       { name: "ACI", fiscalCode: "00907501001" },
  //       { name: "Comune di Ripalta Cremasca", fiscalCode: "00301970190" },
  //       { name: "Comune di Palermo", fiscalCode: "80016350821" },
  //       { name: "Comune di Garbagnate Milanese", fiscalCode: "00792720153" },
  //       { name: "Roma Capitale", fiscalCode: "02438750586" },
  //       {
  //         name: "Comune di Santa Maria la Carità",
  //         fiscalCode: "90001310631"
  //       },
  //       { name: "Comune di Sala Baganza", fiscalCode: "00442530341" },
  //       { name: "Comune di Collecchio", fiscalCode: "00168090348" },
  //       { name: "Comune di Montechiarugolo", fiscalCode: "92170530346" },
  //       { name: "Comune di Bagnacavallo", fiscalCode: "00257850396" },
  //       { name: "Comune di Felino", fiscalCode: "00202030342" },
  //       { name: "Comune di Novellara", fiscalCode: "00441550357" },
  //       { name: "Comune di Traversetolo", fiscalCode: "00220040349" },
  //       { name: "Comune di Rimini", fiscalCode: "00304260409" },
  //       { name: "Comune di Reggio Emilia", fiscalCode: "00145920351" },
  //       { name: "Comune di Cremona", fiscalCode: "00297960197" },
  //       {
  //         name: "Comune di Campello sul Clitunno",
  //         fiscalCode: "84002330540"
  //       },
  //       { name: "Comune di Sarzana", fiscalCode: "00192320117" },
  //       { name: "Comune di Campi Bisenzio", fiscalCode: "80016750483" },
  //       { name: "Agenzia delle Entrate", fiscalCode: "06363391001" },
  //       { name: "Comune di Cancello ed Arnone", fiscalCode: "80005450616" },
  //       { name: "Comune di Grottaglie", fiscalCode: "00117380733" },
  //       { name: "Comune di Sommacampagna", fiscalCode: "00259810232" },
  //       { name: "Comune di Villaricca", fiscalCode: "80034870636" },
  //       { name: "Comune di Carinaro", fiscalCode: "81001470616" },
  //       { name: "Comune di Cornuda", fiscalCode: "83000710265" },
  //       { name: "Comune di Russi", fiscalCode: "00246880397" },
  //       {
  //         name: "Consorzio di Bonifica 3 Medio Valdarno",
  //         fiscalCode: "06432250485"
  //       },
  //       { name: "Comune di Sassuolo", fiscalCode: "00235880366" },
  //       {
  //         name: "Comune di Prignano sulla Secchia",
  //         fiscalCode: "84002010365"
  //       },
  //       { name: "Comune di Lecco", fiscalCode: "00623530136" },
  //       { name: "Comune di Palagano", fiscalCode: "00415030360" },
  //       { name: "Comune di Montefiorino", fiscalCode: "00495090367" },
  //       { name: "Comune di Frassinoro", fiscalCode: "84002170367" },
  //       { name: "Comune di Formigine", fiscalCode: "00603990367" },
  //       { name: "Comune di Fiorano Modenese", fiscalCode: "84001590367" },
  //       { name: "Comune di Silea", fiscalCode: "80007710264" },
  //       { name: "Comune di Maranello", fiscalCode: "00262700362" },
  //       { name: "Comune di Colli a Volturno", fiscalCode: "00031500945" },
  //       {
  //         name: "IO - L'app dei servizi pubblici",
  //         fiscalCode: "15376371009"
  //       },
  //       { name: "Garda Uno S.p.a.", fiscalCode: "87007530170" },
  //       { name: "Comune di Tortorici", fiscalCode: "84004890830" }
  //     ],
  //     nameByFiscalCode: {
  //       "00514490010": "Città di Torino",
  //       "01199250158": "Comune di Milano",
  //       "09000640012": "Città di Torino",
  //       "80010170266": "Comune di Preganziol",
  //       "03334231200": "Comune di Valsamoggia",
  //       "00493410583": "ACI",
  //       "00907501001": "ACI",
  //       "00301970190": "Comune di Ripalta Cremasca",
  //       "80016350821": "Comune di Palermo",
  //       "00792720153": "Comune di Garbagnate Milanese",
  //       "02438750586": "Roma Capitale",
  //       "90001310631": "Comune di Santa Maria la Carità",
  //       "00442530341": "Comune di Sala Baganza",
  //       "00168090348": "Comune di Collecchio",
  //       "92170530346": "Comune di Montechiarugolo",
  //       "00257850396": "Comune di Bagnacavallo",
  //       "00202030342": "Comune di Felino",
  //       "00441550357": "Comune di Novellara",
  //       "00220040349": "Comune di Traversetolo",
  //       "00304260409": "Comune di Rimini",
  //       "00145920351": "Comune di Reggio Emilia",
  //       "00297960197": "Comune di Cremona",
  //       "84002330540": "Comune di Campello sul Clitunno",
  //       "00192320117": "Comune di Sarzana",
  //       "80016750483": "Comune di Campi Bisenzio",
  //       "06363391001": "Agenzia delle Entrate",
  //       "80005450616": "Comune di Cancello ed Arnone",
  //       "00117380733": "Comune di Grottaglie",
  //       "00259810232": "Comune di Sommacampagna",
  //       "80034870636": "Comune di Villaricca",
  //       "81001470616": "Comune di Carinaro",
  //       "83000710265": "Comune di Cornuda",
  //       "00246880397": "Comune di Russi",
  //       "06432250485": "Consorzio di Bonifica 3 Medio Valdarno",
  //       "00235880366": "Comune di Sassuolo",
  //       "84002010365": "Comune di Prignano sulla Secchia",
  //       "00623530136": "Comune di Lecco",
  //       "00415030360": "Comune di Palagano",
  //       "00495090367": "Comune di Montefiorino",
  //       "84002170367": "Comune di Frassinoro",
  //       "00603990367": "Comune di Formigine",
  //       "84001590367": "Comune di Fiorano Modenese",
  //       "80007710264": "Comune di Silea",
  //       "00262700362": "Comune di Maranello",
  //       "00031500945": "Comune di Colli a Volturno",
  //       "15376371009": "IO - L'app dei servizi pubblici",
  //       "87007530170": "Garda Uno S.p.a.",
  //       "84004890830": "Comune di Tortorici"
  //     }
  //   },
  //   paymentByRptId: {},
  //   calendarEvents: { byMessageId: {} },
  //   transactionsRead: {},
  //   _persist: { version: -1, rehydrated: true }
  // },
  // debug: { isDebugModeEnabled: false },
  persistedPreferences: {
    wasServiceAlertDisplayedOnce: false,
    isPagoPATestEnabled: false,
    isExperimentalFeaturesEnabled: false,
    isCustomEmailChannelEnabled: { kind: "PotSome", value: false },
    continueWithRootOrJailbreak: false,
    preferredLanguage: "it",
    isFingerprintEnabled: false
  },
  // installation: { isFirstRunAfterInstall: false },
  // payments: {
  //   current: { kind: "UNSTARTED" },
  //   lastDeleted: null,
  //   history: []
  // },
  content: {
    //   servicesMetadata: { byId: {} },
    //   municipality: {
    //     codiceCatastale: { kind: "PotSome", value: "E335" },
    //     data: {
    //       kind: "PotSome",
    //       value: {
    //         codiceProvincia: "023",
    //         codiceRegione: "14",
    //         denominazione: "Isernia",
    //         denominazioneInItaliano: "Isernia",
    //         denominazioneRegione: "Molise",
    //         siglaProvincia: "IS"
    //       }
    //     }
    //   },
    //   servicesByScope: {
    //     kind: "PotSome",
    //     value: {
    //       NATIONAL: [
    //         "azure-deployc49a",
    //         "01DBJNFSJYB53TP0AZNA8FQGJJ",
    //         "01DBJNW5NR2M2VQTM7VG0SGNNZ",
    //         "01DBJNYDCT0Q5G0D0K7RFS2R2F",
    //         "01EMNQDSTD9F3WEFQYA5WWWHZY",
    //         "01E05AVS80MJDMS02EFWVT53H5",
    //         "01E05AVT3X56X1Z4R19AT7CJ84",
    //         "01E05E5HA9WXBEPYXACMB1KX2B",
    //         "01E1BR45PST73CEW511QVM2W89",
    //         "01E1BR5ETNYBDMQCDY3QBC9FHA",
    //         "01E1BR63EK8ZZ5WWKRAXB473Y8",
    //         "01E31S9SVARB82QX444XRCQKNA",
    //         "01EB8AXKNV6NMSP2R25KSGF743"
    //       ],
    //       LOCAL: [
    //         "01D5ECFA96C6HYNPXVC6P55D1S",
    //         "01D721ZVRSXW793EK43HTAQM05",
    //         "01D72312AZT81N4JC3GV6980CK",
    //         "01D5RQM2NVWM2QVZPQQ4FC8Z2E",
    //         "01DPB2JK990ASH9C6B14Q43SH4",
    //         "01DHVH3X6E29SB4KAGBFPZGS2A",
    //         "01DMNDFTJ4MGBW9CXA3Y5N91W4",
    //         "01D4AQHBKESFSX98TK52PMD5S3",
    //         "01D4AQHCWWH2366GDBHV6MXDVT",
    //         "01D4AQHE0R5DRJJ9635WSK7GZE",
    //         "01D81BTR75QGVVCC2ASSSZNSNV",
    //         "01D9VYPJ9S41QCD3E6XE3K6D1N",
    //         "01DECE05RF356RDC7QV1DAT2QR",
    //         "01DCER0VWBJVY6K6YXK1XM54C9",
    //         "01DCER17X2DG6DBD7ZMN1Z95H7",
    //         "01DCER0ANWQF5908X5YX3NKJD0",
    //         "01DEYQGXBN1XB9W6RDZV94V20A",
    //         "01DBAW7AY7RP4E3EMST2X21K3W",
    //         "01DNEZT8BC7MFM96Q4J0MS72E2",
    //         "01DTPWX4HQARDDJ3QTDCAX5MK4",
    //         "01DBCRF8455F7NE9QE8TPEJVRV",
    //         "01DBCRDSXAT2CP73KVFHFSXD0P",
    //         "01EDE5Z3RHY0G67Y29WZF11J6G",
    //         "01EDE62JTDFATVRYV0CGBPNXX2",
    //         "01E2XCR1N4VNMG18XJ5BD4BV9Y",
    //         "01E2XBVNSB2SZDJZGFP020C2YX",
    //         "01E36YVB7NDWK7FFF6DBNVDZTP",
    //         "01E36YSSP6ZG76GDHHT8VM9EKE",
    //         "01E36YY11TMJAC7W9FH0ETF3QZ",
    //         "01E36YXDGHHR9RQB465AH8NEJQ",
    //         "01E4XD5N8F4XH9ARGV3SAXMZT0",
    //         "01E6TTG0VG6DFVFMCEZJQDDM39",
    //         "01DVQZ21YD356PH8V5G1S5KMN3",
    //         "01DVQZ2G99HQ0GW27MSD1ECC9P",
    //         "01E2E0E80Z4TR72V43XVZGX4KF",
    //         "01E1YAB4X63WG8BPBVR43KH3J1",
    //         "01E219K9CX4BHFJTGE868HPJ59",
    //         "01E4WV19MWPYYFMBTVAZSAGWPC",
    //         "01EAC1S4YXN04WC6GZJ2HX9651",
    //         "01EAC1VBNAQ30AF1C0H8JTFGXN",
    //         "01E8PWHM514G7YP06WPDMGH0V5",
    //         "01E9FQBB51N80EJ79Y1RFQC2XD",
    //         "01E9Z5M0N9FK3AQYXPZ4F0CKR9",
    //         "01E9Z5V0EK8HS8KZV0CB12421Z",
    //         "01E983KMACRZ0MTWEKP6TVC0W6",
    //         "01E6C1NPEK6475G10YRJ139JJG",
    //         "01EDVBSFKB1WHWHJW915SYER7F",
    //         "01EDVC0034TXCADN1XFY4375VS",
    //         "01EDVC3RWMJV1NT9YH4J141B9S",
    //         "01EEA5C29SJEE918D2AE1SH68H",
    //         "01EDY252DS9HTNNHRJ83PRXAVA",
    //         "01EDY3N93S3WR6ZTP5G1WZ9YG9",
    //         "01EHC41R5RKPCZCEPNF8A8XWWN",
    //         "01D88CM09S0SB72B7AN92XGKPC",
    //         "01ED912D869F64PZCPR1XQR61E",
    //         "01EHC02SVSKQ2M97DDSY3HAJWN",
    //         "01EHC0FY33PQFJXWQJ99K108J8",
    //         "01EHC0HHDCT3WK0G04SFBMT44E",
    //         "01ECMDBNECKX2FQATF37TQNSYQ",
    //         "01ECMDCWM0CAC98HZS7WHJZQQ1",
    //         "01EHY17SEV6YYG6Z1CSAQGM8MC",
    //         "01EHY18EHZEDCTEHNF3T6RP49F",
    //         "01EHY18TQYNE7S325G7TEKF322",
    //         "01EHWBMQ91QPTWECS5AW8W6W5P",
    //         "01EHWBSWXBJ3ZW7BABKG8Y5TMB",
    //         "01EHSJ7H1KEE33PMJTMP670Z35",
    //         "01E7MGBS956ADAH12N65TQZ83A",
    //         "01EA1R4S59VG36BPB7SDQXQKNN",
    //         "01EA1RD59JJPWY254P0FRT3VHC",
    //         "01EM1AWDX0X4MWQW7D2FJHTC72",
    //         "01EM1B5EX7RA6ER00KZYF7AEXG",
    //         "01EM1AYAV7Z5J41ZNNH7RSEQ5F",
    //         "01EM1AZXRQ1PA5XKHHBN18W5C6",
    //         "01EM1B35MHJG5G47QPS0KE0KAR",
    //         "01EM1B7JE2Z0PRNV23RVXTCEXC",
    //         "01EM1B8DNCVJD7VXJ5SFPEQD44",
    //         "01EM1B9G8HCK2TM3NTF9W0N5D9",
    //         "01EM1BAAY94S0B2XNFB615M1VW",
    //         "01EJXN09K6WA7QQPQ7YG5HA4XP",
    //         "01EKD04W78N0TM0W0CE9T4N6NV",
    //         "01EK01NRM0KB14JGW25J5365QX",
    //         "01EM3Z9QAQWTWHFEV9JS5JCN0B",
    //         "01EM3ZD0HP8K222GV9S8JPC9C4",
    //         "01EM3ZE3W7PBBYGSH27TSFH2DR",
    //         "01EM3ZF5YGN6KGN77S0H50W865",
    //         "01EM3ZGA1C6KVT7M66W4XPRA42",
    //         "01EM3ZH9NSXSCZW5ZC267H69S0",
    //         "01EMGGTMA3N4794RMN751BVY7B",
    //         "01EMGGV2YMEMVFGC7ED2385FJB",
    //         "01EMGGVCRVS672MQGPJ32YYM7R",
    //         "01EMGGVX6SS8AG70B8E72X4XCM",
    //         "01EMGGW8P485YCE80K0KCX8A8B",
    //         "01EK0738Y1HDNXFHRQZ54SQSK7",
    //         "01EKAKNKAW7YY57P09ZT0BT3ND",
    //         "01EKAMCZ8592P034H91Y8MV7R5"
    //       ]
    //     }
    //   },
    contextualHelp: {
      kind: "PotSome",
      value: {
        version: 1,
        it: {
          screens: [],
          idps: {
            arubaid: {
              description:
                "Se riscontri altri problemi nella procedura di autenticazione, puoi contattare il servizio dedicato offerto da Aruba selezionando una delle opzioni disponibili qui.",
              helpdesk_form:
                "https://selfcarespid.aruba.it/#/recovery-emergency-code",
              phone: "003905750504",
              web_site: "https://www.pec.it/richiedi-spid-aruba-id.aspx",
              recover_username:
                "https://selfcarespid.aruba.it/#/recovery-username",
              recover_password:
                "https://selfcarespid.aruba.it/#/recovery-password",
              recover_emergency_code:
                "https://selfcarespid.aruba.it/#/recovery-emergency-code"
            },
            infocertid: {
              description:
                "Se riscontri altri problemi nella procedura di autenticazione, puoi contattare il servizio dedicato offerto da InfoCert  selezionando una delle opzioni disponibili qui di seguito. \n Inoltre, per ulteriori informazioni puoi consultare la [le FAQ e le guide](https://help.infocert.it/Cerca?searchText=spid) fornite dal tuo Identity Provider.",
              helpdesk_form: "https://contatta.infocert.it/ticket/",
              phone: "00390654641489",
              web_site: "https://identitadigitale.infocert.it/",
              recover_username:
                "https://help.infocert.it/home/faq/come-posso-recuperare-la-user-id-di-accesso-alla-mia-identita-digitale",
              recover_password: "https://my.infocert.it/selfcare/#/recoveryPin"
            },
            intesaid: {
              description:
                "Se riscontri altri problemi nella procedura di autenticazione, puoi contattare il servizio dedicato offerto da Intesa  selezionando una delle opzioni disponibili qui di seguito.",
              email: "hdintesa@advalia.com",
              helpdesk_form: "https://www.hda.intesa.it/area-clienti",
              phone: "800805093",
              phone_international: "00390287119396",
              web_site: "https://www.intesa.it/intesaid",
              recover_password:
                "https://spid.intesa.it/area-privata/recupera-password.aspx"
            },
            lepidaid: {
              description:
                "Se riscontri altri problemi nella procedura di autenticazione, puoi contattare il servizio dedicato offerto da Lepida selezionando una delle opzioni disponibili qui di seguito. \nInoltre, per ulteriori informazioni puoi consultare il [Manuale Utente](https://id.lepida.it/docs/manuale_utente.pdf) fornito da tuo Identity Provider.",
              email: "helpdesk@lepida.it",
              helpdesk_form:
                "https://www.lepida.net/assistenza/richiesta-assistenza-lepidaid",
              phone: "800445500",
              web_site: "https://id.lepida.it/idm/app/#lepida-spid-id",
              recover_username:
                "https://id.lepida.it/lepidaid/recuperausername",
              recover_password: "https://id.lepida.it/lepidaid/recuperapassword"
            },
            namirialid: {
              description:
                "Se riscontri altri problemi nella procedura di autenticazione, puoi contattare il servizio dedicato offerto da Namirial selezionando una delle opzioni disponibili qui di seguito. \nInoltre, per ulteriori informazioni puoi consultare le [FAQ](https://support.namirial.com/it/faq/faq-tsp/faq-tsp-spid) fornite dal tuo Identity Provider.",
              helpdesk_form: "https://support.namirial.com/it/supporto-tecnico",
              phone: "003907163494",
              web_site: "https://www.namirialtsp.com/spid/",
              recover_username:
                "https://portal.namirialtsp.com/public/retrieveUsername.xhtml",
              recover_password:
                "https://portal.namirialtsp.com/public/resetPassword.xhtml"
            },
            posteid: {
              description:
                "Se riscontri altri problemi nella procedura di autenticazione, puoi contattare il servizio dedicato offerto da Poste Italiane  selezionando una delle opzioni disponibili qui di seguito. \nInoltre, per ulteriori informazioni puoi consultare le [FAQ](https://www.poste.it/faq-poste-id.html) fornite dal tuo Identity Provider ed il [Manuale Utente](https://posteid.poste.it/risorse/condivise/doc/manuale_operativo.pdf).",
              helpdesk_form: "https://www.poste.it/scrivici.html",
              phone: "800007777",
              web_site: "https://posteid.poste.it",
              recover_username:
                "https://posteid.poste.it/recuperocredenziali.shtml",
              recover_password:
                "https://posteid.poste.it/recuperocredenziali.shtml"
            },
            sielteid: {
              description:
                "Se riscontri altri problemi nella procedura di autenticazione, puoi contattare il servizio dedicato offerto da Sielte  selezionando una delle opzioni disponibili qui di seguito. \nInoltre, per ulteriori informazioni puoi consultare le [FAQ](https://www.sielteid.it/faq.html) fornite dal tuo Identity Provider ed il [Manuale Utente](https://www.sielteid.it/documents/ManualeUtente.pdf).",
              helpdesk_form:
                "https://www.sielteid.it/contact.html#blocco-contatti-form",
              phone: "00390957171301",
              web_site: "https://www.sielteid.it/che-cos-e-sielteid.html",
              recover_password:
                "https://myid.sieltecloud.it/profile/forgotPassword"
            },
            spiditalia: {
              description:
                "Se riscontri altri problemi nella procedura di autenticazione, puoi contattare il servizio dedicato offerto da Register mediante il bottone qui di seguito. \nInoltre, per ulteriori informazioni puoi consultare le [FAQ](https://www.register.it/spid#pgc-23051-10-0) fornite dal tuo Identity Provider ed il [Manuale Utente](https://spid.register.it/doc/Guida_Utente_SPID.pdf).",
              phone: "+390355787979",
              web_site: "https://www.register.it/spid/ ",
              recover_username:
                "https://spid.register.it/selfcare/recovery/username ",
              recover_password:
                "https://spid.register.it/selfcare/recovery/password"
            },
            timid: {
              description:
                "Se riscontri altri problemi nella procedura di autenticazione, puoi contattare il servizio dedicato offerto da Tim  selezionando una delle opzioni disponibili qui di seguito. \nInoltre, per ulteriori informazioni puoi consultare il [Manuale Utente](https://www.trusttechnologies.it/wp-content/uploads/SPIDPRIN.TT_.DPMU15000.03-Guida-Utente-al-servizio-TIM-ID.pdf) fornito dal tuo Identity Provider.",
              email: "supportotimid@telecomitalia.it",
              helpdesk_form: "https://www.trusttechnologies.it/contatti/#form",
              phone: "800405800",
              web_site: "https://spid.tim.it/tim-id-portal",
              recover_username: "https://login.id.tim.it/mps/fu.php",
              recover_password: "https://login.id.tim.it/mps/fp.php"
            }
          }
        },
        en: {
          screens: [],
          idps: {
            arubaid: {
              description:
                "For problems encountered during the authentication process , you can reach the support desk of Aruba by selecting  one of the options presented below.",
              helpdesk_form:
                "https://selfcarespid.aruba.it/#/recovery-emergency-code",
              phone: "003905750504",
              web_site: "https://www.pec.it/richiedi-spid-aruba-id.aspx",
              recover_username:
                "https://selfcarespid.aruba.it/#/recovery-username",
              recover_password:
                "https://selfcarespid.aruba.it/#/recovery-password",
              recover_emergency_code:
                "https://selfcarespid.aruba.it/#/recovery-emergency-code"
            },
            infocertid: {
              description:
                "For problems encountered during the authentication process,  you can reach the support desk of InfoCert by selecting  one of the options presented below. \n For further details you can refer to the [FAQ](https://help.infocert.it/Cerca?searchText=spid) gathered by your Identity Provider.",
              helpdesk_form: "https://contatta.infocert.it/ticket/",
              phone: "00390654641489",
              web_site: "https://identitadigitale.infocert.it/",
              recover_username:
                "https://help.infocert.it/home/faq/come-posso-recuperare-la-user-id-di-accesso-alla-mia-identita-digitale",
              recover_password: "https://my.infocert.it/selfcare/#/recoveryPin"
            },
            intesaid: {
              description:
                "For problems encountered during the authentication process,  you can reach the support desk of Intesa by selecting  one of the options presented below.",
              email: "hdintesa@advalia.com",
              helpdesk_form: "https://www.hda.intesa.it/area-clienti",
              phone: "800805093",
              phone_international: "00390287119396",
              web_site: "https://www.intesa.it/intesaid",
              recover_password:
                "https://spid.intesa.it/area-privata/recupera-password.aspx"
            },
            lepidaid: {
              description:
                "For problems encountered during the authentication process,  you can reach the support desk of Lepida by selecting  one of the options presented below. \n For further details you can refer to the [User Guide](https://id.lepida.it/docs/manuale_utente.pdf).",
              email: "helpdesk@lepida.it",
              helpdesk_form:
                "https://www.lepida.net/assistenza/richiesta-assistenza-lepidaid",
              phone: "800445500",
              web_site: "https://id.lepida.it/idm/app/#lepida-spid-id",
              recover_username:
                "https://id.lepida.it/lepidaid/recuperausername",
              recover_password: "https://id.lepida.it/lepidaid/recuperapassword"
            },
            namirialid: {
              description:
                "For problems encountered during the authentication process,  you can reach the support desk of Namirial by selecting  one of the options presented below. \n For further details you can refer to the [FAQ](https://support.namirial.com/it/faq/faq-tsp/faq-tsp-spid) gathered by your Identity Provider.",
              helpdesk_form: "https://support.namirial.com/it/supporto-tecnico",
              phone: "003907163494",
              web_site: "https://www.namirialtsp.com/spid/",
              recover_username:
                "https://portal.namirialtsp.com/public/retrieveUsername.xhtml",
              recover_password:
                "https://portal.namirialtsp.com/public/resetPassword.xhtml"
            },
            posteid: {
              description:
                "For problems encountered during the authentication process,  you can reach the support desk of Poste Italiane by selecting  one of the options presented below. \n For further details you can refer to the [FAQ](https://www.poste.it/faq-poste-id.html) gathered by your Identity Provider and the [User Guide](https://posteid.poste.it/risorse/condivise/doc/manuale_operativo.pdf).",
              helpdesk_form: "https://www.poste.it/scrivici.html",
              phone: "800007777",
              web_site: "https://posteid.poste.it",
              recover_username:
                "https://posteid.poste.it/recuperocredenziali.shtml",
              recover_password:
                "https://posteid.poste.it/recuperocredenziali.shtml"
            },
            sielteid: {
              description:
                "For problems encountered during the authentication process,  you can reach the support desk of Sielte by selecting  one of the options presented below. \n For further details you can refer to the [FAQ](https://www.sielteid.it/faq.html) gathered by your Identity Provider and the [User Guide](https://www.sielteid.it/faq.html).",
              helpdesk_form:
                "https://www.sielteid.it/contact.html#blocco-contatti-form",
              phone: "00390957171301",
              web_site: "https://www.sielteid.it/che-cos-e-sielteid.html",
              recover_password:
                "https://myid.sieltecloud.it/profile/forgotPassword"
            },
            spiditalia: {
              description:
                "For problems encountered during the authentication process,  you can reach the support desk of Sielte by selecting  the button below. \n For further details you can refer to the [FAQ](https://www.register.it/spid#pgc-23051-10-0) gathered by your Identity Provider and the [User Guide](https://spid.register.it/doc/Guida_Utente_SPID.pdf).",
              phone: "+390355787979",
              web_site: "https://www.register.it/spid/ ",
              recover_username:
                "https://spid.register.it/selfcare/recovery/username ",
              recover_password:
                "https://spid.register.it/selfcare/recovery/password"
            },
            timid: {
              description:
                "For problems encountered during the authentication process,  you can reach the support desk of Tim by selecting  one of the options presented below. \n For further details you can refer to the [User Guide](https://www.trusttechnologies.it/wp-content/uploads/SPIDPRIN.TT_.DPMU15000.03-Guida-Utente-al-servizio-TIM-ID.pdf).",
              email: "supportotimid@telecomitalia.it",
              helpdesk_form: "https://www.trusttechnologies.it/contatti/#form",
              phone: "800405800",
              web_site: "https://spid.tim.it/tim-id-portal",
              recover_username: "https://login.id.tim.it/mps/fu.php",
              recover_password: "https://login.id.tim.it/mps/fp.php"
            }
          }
        }
      }
    }
  }
  // emailValidation: {
  //   sendEmailValidationRequest: { kind: "PotNone" },
  //   acknowledgeOnEmailValidated: { _tag: "None" }
  // },
  // _persist: { version: 14, rehydrated: true }
};

it("rendersCorrectly", () => {
  /* const navigation: any = {
    navigate: jest.fn(),
    state: {
      params: {
        inPayment: fromNullable(null),
        keyFrom: "id-1603703747027-2"
      },
      routeName: "WALLET_ADD_CARD",
      key: "id-1603703747027-8"
    },
    router: undefined,
    actions: {},
    dispatch: jest.fn()
  }; */

  mockReactRedux().state(initState);

  debug(mockReactRedux);

  const { toJSON } = render(
    <View>
      <MockedNavigator component={AddCardScreen} />
    </View>
  );

  expect(toJSON()).toMatchSnapshot();
});

function Wrapper({ children }: any) {
  const mockStore = configureCustomMockStore();
  const myStore = mockStore({});
  return <Provider store={myStore}>{children}</Provider>;
}

test("rendersCorrectlyStore", () => {
  /* const navigation: any = {
    navigate: jest.fn(),
    state: {
      params: {
        inPayment: fromNullable(null),
        keyFrom: "id-1603703747027-2"
      },
      routeName: "WALLET_ADD_CARD",
      key: "id-1603703747027-8"
    },
    router: undefined,
    actions: {},
    dispatch: jest.fn()
  }; */

  const { toJSON } = render(<MockedNavigator component={AddCardScreen} />, {
    wrapper: Wrapper
  });

  expect(toJSON()).toMatchSnapshot();
});
