// import CallingExtensions, { Constants } from "@hubspot/calling-extensions-sdk";

import CallingExtensions from "../src/CallingExtensions";
import {
  errorType
} from "../src/Constants";


var engagementIdconst = "";

var Thread = {
  sleep: function(ms) {
    var start = Date.now();

    while (true) {
      var clock = (Date.now() - start);
      if (clock >= ms) break;
    }

  }
};

const callback = () => {
  var callId = "";
  var hubId = "";
  var called = "";

  let rowId = 0;
  const incomingMsgContainer = document.querySelector("#incomingMsgs");

  function appendMsg(data, event) {
    // const div = document.createElement("div");
    // rowId += 1;
    // div.innerHTML = `<span>${rowId}: </span><span>${
    //   event.type
    // }, ${JSON.stringify(data)}</span>`;
    // incomingMsgContainer.append(div);
  }

  const defaultSize = {
    width: 400,
    height: 600
  };

  const state = {};

  const cti = new CallingExtensions({
    debugMode: true,
    eventHandlers: {
      onReady: () => {
        cti.initialized({
          isLoggedIn: true,
          sizeInfo: defaultSize
        });
      },
      onDialNumber: (data, rawEvent) => {
        // appendMsg(data, rawEvent);
        console.log("aqui!");
        const {
          phoneNumber
        } = data;
        state.phoneNumber = phoneNumber;
        window.setTimeout(
          () =>
          cti.outgoingCall({
            createEngagement: true,
            phoneNumber
          }),
          500
        );
      },
      onEngagementCreated: (data, rawEvent) => {
        const {
          engagementId
        } = data;
        state.engagementId = engagementId;
        engagementIdconst = state.engagementId;
        // appendMsg(data, rawEvent);
        console.log(rawEvent);
      },
      onEndCall: () => {
        window.setTimeout(() => {
          cti.callEnded();
        }, 500);
      },
      onVisibilityChanged: (data, rawEvent) => {
        // appendMsg(data, rawEvent);
      }
    }
  });

  const element = document.querySelector(".controls");

  element.addEventListener("click", event => {
    const clickedButtonValue = event.target.value;
    switch (clickedButtonValue) {
      case "initialized":
        cti.initialized({
          isLoggedIn: true
        });
        break;
      case "log in":
        cti.userLoggedIn();
        break;
      case "log out":
        cti.userLoggedOut();
        break;
        // Calls
      case "incoming call":
        window.setTimeout(() => {
          cti.incomingCall();
        }, 500);
        break;
      case "INICIAR CHAMADA":
        window.setTimeout(() => {
          cti.outgoingCall({
            createEngagement: "true",
            phoneNumber: state.phoneNumber
          });

          hubId = localStorage.getItem("contact").split("/")[0];
          var call = {
            caller: "1000",
            called: state.phoneNumber
          }
          $.ajax({
            url: "https://170.254.79.160:8081/fale-mais/v1/calls/?hubId=7360356",
            type: "post",
            data: JSON.stringify(call),
            headers: {
              "Content-Type": "application/json"
            },
            success: function(data) {
              callId = data.callId;
              // console.log(validacaoChamada(callId));
              validacaoChamada(callId);
              function validacaoChamada(callId) {
                    $.ajax({
                      url: "https://170.254.79.160:8081/fale-mais/v1/calls?callId=" + callId + "&hubId=" + hubId,
                      type: "get",
                      data: "",
                      headers: {
                        "Content-Type": "application/json"
                      },
                      success: function(dataStatus) {
                        console.log(dataStatus);
                        if(dataStatus.state === "finished" || dataStatus.state === "failed"){
                          $.ajax({
                            url: "https://170.254.79.160:8081/hubspot/v1/api/contact/engagement?callId=" + callId + "&called=" + state.phoneNumber + "&engagementId=" + state.engagementId + "&hubId=" + hubId + "&end=1",
                            type: "post",
                            data: "",
                            headers: {
                              "Content-Type": "application/json"
                            },
                            success: function(dataEndCall) {
                              console.log(dataEndCall);
                            },
                            error: function(error) {
                              result = error;
                              console.log(error);
                              alert("Erro no processo");
                            }
                          });
                          cti.callEnded();
                        }else{
                            setTimeout(validacaoChamada(callId), 100000);
                        }
                      },
                      error: function(errorDataStatus) {
                        console.log(errorDataStatus);
                        alert("Erro no processo");
                      }
                    });
                }
            },
            error: function(error) {
              console.log(error);
              alert("Erro no processo");
            }
          });
        }, 500);
        break;
      case "call answered":
        cti.callAnswered();
        break;
      case "FINALIZAR CHAMADA":
        var endCall = {
          callId: callId,
          called: state.phoneNumber
        }
        $.ajax({
          url: "https://170.254.79.160:8081/hubspot/v1/api/contact/engagement?callId=" + callId + "&called=" + state.phoneNumber + "&engagementId=" + state.engagementId + "&hubId=" + hubId + "&end=0",
          type: "post",
          data: "",
          headers: {
            "Content-Type": "application/json"
          },
          success: function(dataEndCall) {
            console.log(dataEndCall);
          },
          error: function(error) {
            result = error;
            console.log(error);
            alert("Erro no processo");
          }
        });
        cti.callEnded();
        break;
      case "call completed":
        cti.callCompleted({
          engagementId: state.engagementId
        });
        break;
      case "send error":
        cti.sendError({
          type: errorType.GENERIC,
          message: "This is a message shown in Hubspot UI"
        });
        break;
      case "change size":
        defaultSize.width += 20;
        defaultSize.height += 20;
        cti.resizeWidget({
          width: defaultSize.width,
          height: defaultSize.height
        });
        break;
      default:
        break;
    }
  });
};


if (
  document.readyState === "interactive" ||
  document.readyState === "complete"
) {
  console.log(window);
  window.setTimeout(() => callback(), 1000);
} else {
  document.addEventListener("DOMContentLoaded", callback);
}
