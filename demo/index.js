// import CallingExtensions, { Constants } from "@hubspot/calling-extensions-sdk";

import CallingExtensions from "../src/CallingExtensions";
import {
  errorType
} from "../src/Constants";


var engagementIdconst = "";

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
      case "início chamada":
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
            url: "https://170.254.79.160:8081/fale-mais/v1/calls/?hubId=" + hubId,
            type: "post",
            data: JSON.stringify(call),
            headers: {
              "Content-Type": "application/json"
            },
            success: function(data) {
              callId = data.callId;
              console.log("Ligacao feita com sucesso: " + callId);
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
      case "fim chamada":
        var endCall = {
          callId: callId,
          called: state.phoneNumber
        }
        $.ajax({
          url: "https://170.254.79.160:8081/hubspot/v1/api/contact/engagement?callId=" + callId + "&called=" + state.phoneNumber + "&engagementId=" + state.engagementId +"&hubId=" + hubId,
          type: "post",
          data: "",
          headers: {
            "Content-Type": "application/json"
          },
          success: function(dataEndCall) {
            console.log(dataEndCall);
            // $.ajax({
            //   url: "https://hubspotapi.herokuapp.com/v1/calls?callId=" + callId,
            //   type: "get",
            //   headers: {
            //     "Content-Type": "application/json"
            //   },
            //   success: function(dataStatus) {
            //     console.log(dataStatus);
            //     appendMsg(dataStatus.linkAudio, event );
            //   },
            //   error: function(error) {
            //     result = error;
            //     console.log(error);
            //     alert("Erro no processo");
            //   }
            // });
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


function finalizacaoChamada(callId, phoneNumber) {
  var endCall = {
    callId: callId,
    called: phoneNumber
  }
  $.ajax({
    url: "https://hubspotapi.herokuapp.com/v1/calls/endcall",
    type: "post",
    data: JSON.stringify(endCall),
    headers: {
      "Content-Type": "application/json"
    },
    success: function(data) {
      console.log(data);
      result = data.state;
    },
    error: function(error) {
      result = error;
      console.log(error);
      alert("Erro no processo");
    }
  });
}

function validacaoChamada(data) {
  var result = "";
  $.ajax({
    url: "https://hubspotapi.herokuapp.com/v1/calls?callId=" + data.callId,
    type: "get",
    headers: {
      "Content-Type": "application/json"
    },
    success: function(data) {
      console.log(data);
      result = data.state;
    },
    error: function(error) {
      result = error;
      console.log(error);
      alert("Erro no processo");
    }
  });
  return result;
}

if (
  document.readyState === "interactive" ||
  document.readyState === "complete"
) {
  console.log(window);
  window.setTimeout(() => callback(), 1000);
} else {
  document.addEventListener("DOMContentLoaded", callback);
}
