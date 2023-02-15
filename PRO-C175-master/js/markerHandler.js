var modelsList = [];

AFRAME.registerComponent("marker-handler", {
  init: function(){
    this.el.addEventListener("markerFound", ()=>{
      var modelName = this.el.getAttribute("model_name");
      var barcodeValue = this.el.getAttribute("value");

      modelsList.push({model_name: modelName, barcode_value: barcodeValue});

      var model = document.querySelector(`#${modelName}-${barcodeValue}`); 
      model.setAttribute("visible", true);
    });
    this.el.addEventListener("markerLost", ()=>{
      var modelName = this.el.getAttribute("model_name");

      var index = modelsList.findIndex(x => x.model_name === modelName);
      if (index >= -1){
        modelsList.splice(index, 1);
      }
    });
  },
  tick: async function(){
    if (modelsList.length > 1){
      var isBaseModelPresent = this.isModelPresentInArray(modelsList, "base");
      var messageText = document.querySelector("#message-text");

      if (!isBaseModelPresent){
        messageText.setAttribute("visible", true);
      } else {
        if (models == null){
          models = await this.getModels();
        }

        messageText.setAttribute("visible", false);
        this.placeTheModel("road", models);
        this.placeTheModel("car", models);
        this.placeTheModel("sun", models);
      }
    }
  },
  getModels: async function(){
    const res = await fetch("js/model.json");
    const data = await res.json();
    return data;
  },
  getDistance: function(elA, elB){
    return elA.object3D.position.distanceTo(elB.object3D.position);
  },
  getModelGeometry: function(models, modelName){
    var barcodes = Object.keys(models);
    for (var barcode of barcodes){
      if (models[barcode].model_name === modelName){
        return {
          position: models[barcode]["placement_position"],
          rotation: models[barcode]["placement_rotation"],
          scale: models[barcode]["placement_scale"],
          model_url: models[barcode]["model_url"]
        };
      };
    };
  },
  isModelPresentInArray: function(arr, val){
    for (var i of arr){
      if (i.model_name === val){
        return true;
      }
    }
    return false;
  }
})