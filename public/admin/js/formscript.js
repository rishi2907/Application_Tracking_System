
function fieldWithCheckBox(fieldName, str) {
  // let html = `<div class="form-check">`;
  let html = ``;
  var data = {};
  for (let i = 0; i < fieldName.length; i++) {
    console.log(mySet)
    mySet.set((str + '#' + fieldName[i].field_name), fieldName[i]);
    if (fieldName[i].field_type == "text") {
      html += `<div class="row form-group mt-3"><div class="col-1">
      <input type="checkbox" onclick="checkdone('`+ str + '#' + fieldName[i].field_name + `')" checked></div>`;
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
      <input type="checkbox" onclick="checkdone('`+ str + '#' + fieldName[i].field_name + `')" checked></div>`;
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
      <input type="checkbox" onclick="checkdone('`+ str + '#' + fieldName[i].field_name + `')"  checked></div>`;
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
    } else if (fieldName[i].field_type == "number") {
      html += `<div class="row form-group mt-3"><div class="col-1">
      <input type="checkbox" onclick="checkdone('`+ str + '#' + fieldName[i].field_name + `')" checked></div>`;
      html += `<div class="col-5"><label for="`;
      html += fieldName[i].field_name;
      html += `">`;
      html += fieldName[i].field_name;
      html += `</label></div>`;

      html += `<div class="col-6"><input type="number" class="form-control" placeholder="" id="`;
      html += fieldName[i].field_name;
      html += `"></div></div></div>`;
    } else if (fieldName[i].field_type == "email") {
      html += `<div class="row form-group mt-3"><div class="col-1">
      <input type="checkbox" onclick="checkdone('`+ str + '#' + fieldName[i].field_name + `')" checked></div>`;
      html += `<div class="col-5"><label for="`;
      html += fieldName[i].field_name;
      html += `">`;
      html += fieldName[i].field_name;
      html += `</label></div>`;

      html += `<div class="col-6"><input type="email" class="form-control" placeholder="" id="`;
      html += fieldName[i].field_name;
      html += `"></div></div></div>`;
    } else if (fieldName[i].field_type == "date") {
      html += `<div class="row form-group mt-3"><div class="col-1">
      <input type="checkbox" onclick="checkdone('`+ str + '#' + fieldName[i].field_name + `')" checked></div>`;
      html += `<div class="col-5"><label for="`;
      html += fieldName[i].field_name;
      html += `">`;
      html += fieldName[i].field_name;
      html += `</label></div>`;

      html += `<div class="col-6"><input type="date" class="form-control" placeholder="" id="`;
      html += fieldName[i].field_name;
      html += `"></div></div></div>`;
    } else if (fieldName[i].field_type == "textarea") {
      html += `<div class="row form-group mt-3"><div class="col-1">
      <input type="checkbox" onclick="checkdone('`+ str + '#' + fieldName[i].field_name + `')" checked></div>`;
      html += `<div class="col-5"><label for="`;
      html += fieldName[i].field_name;
      html += `">`;
      html += fieldName[i].field_name;
      html += `</label></div>`;

      html += `<div class="col-6"><textarea rows="6" cols="50" class="form-control" placeholder="" id="`;
      html += fieldName[i].field_name;
      html += `"></textarea></div></div></div>`;
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

      html += `<div class="col-6"><input type="text" class="form-control" value="" id="`;
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
                    class="custom-file-input" id="validatedCustomFile" value="" >
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
      html += `<div class="col-6"><select class="custom-select" id=`
      html += fieldName[i].field_name;
      html += `>`;

      for (let j = 0; j < fieldName[i].field_value.length; j++) {
        html += `<option value="`;
        html += fieldName[i].field_value[j];
        html += `">`;
        html += fieldName[i].field_value[j];
        html += `</option>`;
      }

      html += `</select></div></div>`;
    } else if (fieldName[i].field_type == "date") {
      html += `<div class="row form-group mt-3">`;
      html += `<div class="col-5"><label for="`;
      html += fieldName[i].field_name;
      html += `">`;
      html += fieldName[i].field_name;
      html += `</label></div>`;

      html += `<div class="col-6"><input type="date" class="form-control" placeholder="" id="`;
      html += fieldName[i].field_name;
      html += `"></div></div></div>`;
    } else if (fieldName[i].field_type == "textarea") {
      html += `<div class="row form-group mt-3">`;
      html += `<div class="col-5"><label for="`;
      html += fieldName[i].field_name;
      html += `">`;
      html += fieldName[i].field_name;
      html += `</label></div>`;

      html += `<div class="col-6"><textarea rows="6" cols="50" class="form-control" placeholder="" id="`;
      html += fieldName[i].field_name;
      html += `"></textarea></div></div></div>`;
    }
    else if (fieldName[i].field_type != "checkbox") {
    }
  }

  return html;
}


function checkdone(str) {

  let temp = str.split("#");

  if (mySet.has(str)) {
    mySet.delete(str);
  }
  else {
    if (temp[0] == "personalInformation") {
      for (let tmp of personalInformation) {
        if (tmp.field_name == temp[1]) {
          mySet.set(str, tmp)
        }
      }
    }
    else if (temp[0] == "educationInformation") {
      for (let tmp of educationInformation) {
        if (tmp.field_name == temp[1]) {
          mySet.set(str, tmp)
        }
      }
    }
    else if (temp[0] == "experienceInformation") {
      for (let tmp of experienceInformation) {
        if (tmp.field_name == temp[1]) {
          mySet.set(str, tmp)
        }
      }
    }
    else if (temp[0] == "additionalInformation") {
      for (let tmp of additionalInformation) {
        if (tmp.field_name == temp[1]) {
          mySet.set(str, tmp)
        }
      }
    }
  }
  console.log(mySet)

}
