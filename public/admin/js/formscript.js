
function fieldWithCheckBox(fieldName, str) {
  // let html = `<div class="form-check">`;
  let html = ``;
  var data = {};
  for (let i = 0; i < fieldName.length; i++) {
    console.log(mySet)
    mySet.set((str + '#' + fieldName[i].field_name), fieldName[i]);
    if (fieldName[i].field_type == "text") {
      html += `<div class="row form-group mt-3"><div class="col-1">
      <input type="checkbox" onclick="checkdone('`+ str + '#' + fieldName[i].field_name + '#' + fieldName[i].field_type + `')" checked></div>`;
      html += `<div class="col-5"><label for="`;
      html += fieldName[i].field_name;
      html += `">`;
      html += fieldName[i].field_name;
      html += `</label></div>`;

      html += `<div class="col-6"><input type="text" class="form-control" placeholder="" id="`;
      html += fieldName[i].field_name;
      html += `"></div></div></div>`;
    } else if (fieldName[i].field_type == "file") {
      html += `<div class="row form-group mt-3"><div class="col-1">
      <input type="checkbox" onclick="checkdone('`+ str + '#' + fieldName[i].field_name + '#' + fieldName[i].field_type + `')" checked></div>`;
      html += `<div class="col-5"><label for="`;
      html += fieldName[i].field_name;
      html += `">`;
      html += fieldName[i].field_name;
      html += `</label></div>`;
      html += `<div class="custom-file col-6"><input type="file" 
                    class="custom-file-input" id="validatedCustomFile" >
                    <label class="custom-file-label" for="validatedCustomFile">`;
      html += fieldName[i].field_name;
      html += `</label>
                    <div class="invalid-feedback">Example invalid custom file feedback</div>
                    </div></div>`;
    } else if (fieldName[i].field_type == "radio") {
      html += `<div class="row form-group mt-3"><div class="col-1">
      <input type="checkbox" onclick="checkdone('`+ str + '#' + fieldName[i].field_name + '#' + fieldName[i].field_type + `')"  checked></div>`;
      html += `<div class="col-5"><label for="`;
      html += fieldName[i].field_name;
      html += `">`;
      html += fieldName[i].field_name;
      html += `</label></div>`;
      html += `<div class="col-6"><select class="custom-select">`;

      for (let j = 0; j < fieldName[i].field_value.length; j++) {
        html += `<option value="`;
        html += fieldName[i].field_value[j];
        html += `">`;
        html += fieldName[i].field_value[j];
        html += `</option>`;
      }

      html += `</select></div></div>`;
    } else if (fieldName[i].field_type != "checkbox") {
    }
  }

  return html;
}


function fieldWithOutCheckBox(fieldName) {
  // let html = `<div class="form-check">`;
  let html = ``;
  var data = {};
  for (let i = 0; i < fieldName.length; i++) {
    console.log(mySet)

    if (fieldName[i].field_type == "text") {
      html += `<div class="row form-group mt-3">`;
      html += `<div class="col-5"><label for="`;
      html += fieldName[i].field_name;
      html += `">`;
      html += fieldName[i].field_name;
      html += `</label></div>`;

      html += `<div class="col-6"><input type="text" class="form-control" placeholder="" id="`;
      html += fieldName[i].field_name;
      html += `"></div></div></div>`;
    } else if (fieldName[i].field_type == "file") {
      html += `<div class="row form-group mt-3">`;
      html += `<div class="col-5"><label for="`;
      html += fieldName[i].field_name;
      html += `">`;
      html += fieldName[i].field_name;
      html += `</label></div>`;
      html += `<div class="custom-file col-6"><input type="file" 
                    class="custom-file-input" id="validatedCustomFile" >
                    <label class="custom-file-label" for="validatedCustomFile">`;
      html += fieldName[i].field_name;
      html += `</label>
                    <div class="invalid-feedback">Example invalid custom file feedback</div>
                    </div></div>`;
    } else if (fieldName[i].field_type == "radio") {
      html += `<div class="row form-group mt-3">`;
      html += `<div class="col-5"><label for="`;
      html += fieldName[i].field_name;
      html += `">`;
      html += fieldName[i].field_name;
      html += `</label></div>`;
      html += `<div class="col-6"><select class="custom-select">`;

      for (let j = 0; j < fieldName[i].field_value.length; j++) {
        html += `<option value="`;
        html += fieldName[i].field_value[j];
        html += `">`;
        html += fieldName[i].field_value[j];
        html += `</option>`;
      }

      html += `</select></div></div>`;
    } else if (fieldName[i].field_type != "checkbox") {
    }
  }

  return html;
}
