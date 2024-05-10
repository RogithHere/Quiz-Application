/*function staff_authentication(){
  let username=document.getElementsByName("username").value;
  let password=document.getElementsByName("password").value;
  const formData = {
    username: username,
    password: password,
    
};
}*/



//admin functions starts

//to display add staff form
const total_questions=0
function displayStaffDetails(){
  
  let staff_form=document.getElementById("add_staff_form")
  staff_form.style.display='block';
  let main_btn=document.getElementById("main_btn");
  main_btn.style.display='none';
  
}

//add_staff functions starts 
function add_staff(){
  const staffName = document.getElementById('staff_name').value;
  const staffEmail = document.getElementById('staff_email').value;
  const staffPass = document.getElementById('staff_pass').value;
  const staffNum = document.getElementById('staff_num').value;

  // Validate the fields
  if (!validateForm(staffName, staffEmail, staffPass, staffNum)) {
      return;
  }

  // Create a JavaScript object to hold the form data
  const formData = {
      staff_name: staffName,
      staff_email: staffEmail,
      staff_pass: staffPass,
      staff_num: staffNum
  };

  // Send a POST request to the server using fetch
  fetch('/store_staff_data', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
          'Content-Type': 'application/json'
      }
  })
  .then(response => response.json())
  .then(data => {
      if (data.success) {
          // Display a success message in an alert
          alert('New staff added successfully');

          // Redirect to the success template after a brief delay
          setTimeout(function() {
              window.location.href = '/admin_main';
          }, 1000); // Delay for 2 seconds (adjust as needed)
      } else {
          alert('Error storing data:'+data.error);
      }
  });
}
function validateForm(staffName, staffEmail, staffPass, staffNum) {
  // You can add your validation logic here
  if (staffName.trim() === '') {
      alert('Staff Name is required.');
      return false;
  }
  if (!isValidEmail(staffEmail)) {
      alert('Invalid Staff Email.');
      return false;
  }
  if (staffPass.trim() === '' || staffPass.length < 6) {
      alert('Password is required and must be at least 6 characters long.');
      return false;
  }
  if (isNaN(staffNum) || staffNum.toString().length !== 10) {
      alert('Staff Number must be a 10-digit number.');
      return false;
  }
  return true;
}

function isValidEmail(email) {
  // Simple email validation using regex
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailPattern.test(email);
}
//add staff functions end here



//to display the add batch form
function displayBatchDetails(){
  let batch_detials=document.getElementById("batch_detials");
  batch_detials.style.display='block';
  let main_btn=document.getElementById("main_btn");
  main_btn.style.display='none';
}

//to create add student input boxes
function createStudents() {
  let container = document.getElementById("add_students");
  let no_of_students = document.getElementById("batch_students").value;
  let btn = document.getElementById("add_students_btn");
  let sub_btn=document.getElementById("submit_details");
  let batchNumber = document.getElementById('batch_number').value;
  if(no_of_students===""||batchNumber===""){
    alert("Provide Both details to proceed..");
    return;
  }

  for (let i = 1; i <= no_of_students; i++) {
    let labelreg = document.createElement("label");
    labelreg.textContent = "Register No:";
    labelreg.setAttribute("for", "student_reg-" + i);
    
    let inputreg = document.createElement("input");
    inputreg.setAttribute("type", "text");
    inputreg.setAttribute("name", "student_reg-" + i);
    inputreg.setAttribute("id", "student_reg-" + i);
    container.appendChild(labelreg);
    container.appendChild(inputreg);



    let labelname = document.createElement("label");
    labelname.textContent = "Name:";
    labelname.setAttribute("for", "student_name-" + i);
    
    let inputname = document.createElement("input");
    inputname.setAttribute("type", "text");
    inputname.setAttribute("name", "student_name-" + i);
    inputname.setAttribute("id", "student_name-" + i);
    container.appendChild(labelname);
    container.appendChild(inputname);


    let label = document.createElement("label");
    label.textContent = "Email:";
    label.setAttribute("for", "student_mail-" + i);
    
    let input = document.createElement("input");
    input.setAttribute("type", "email");
    input.setAttribute("name", "student_mail-" + i);
    input.setAttribute("id", "student_mail-" + i);
    container.appendChild(label);
    container.appendChild(input);

    let label1 = document.createElement("label");
    label1.textContent = "Password:";
    label1.setAttribute("for", "student_pass-" + i);
    

    let input1 = document.createElement("input");
    input1.setAttribute("type", "password");
    input1.setAttribute("name", "student_pass-" + i);
    input1.setAttribute("id", "student_pass-" + i);
    container.appendChild(label1);
    container.appendChild(input1);

    let label2 = document.createElement("label");
    label2.textContent = "Phone Number:";
    label2.setAttribute("for", "student_number-" + i); 
    
    let input2 = document.createElement("input");
    input2.setAttribute("type", "number");
    input2.setAttribute("name", "student_number-" + i);
    input2.setAttribute("id", "student_number-" + i);
    container.appendChild(label2);
    container.appendChild(input2);
    let br1=document.createElement("br");
    container.appendChild(br1);
  }
  btn.style.display = "none";
  container.style.display="block"
  sub_btn.style.display="block";
}


function addStudents(){
  let batchNumber = document.getElementById('batch_number').value;
  let batchStudents = document.getElementById('batch_students').value;

  // Create an array to hold student data
  let students = [];
  let validationFailed = false;

  // Collect student details
  for (let i = 1; i <= batchStudents; i++) {
    let studentreg = document.querySelector(`input[name="student_reg-${i}"]`).value;
    let studentName = document.querySelector(`input[name="student_name-${i}"]`).value;
    let studentEmail = document.querySelector(`input[name="student_mail-${i}"]`).value;
    let studentPass = document.querySelector(`input[name="student_pass-${i}"]`).value;
    let studentNumber = document.querySelector(`input[name="student_number-${i}"]`).value;


    if (
      studentreg.trim() === '' ||
      studentName.trim() === '' ||
      studentEmail.trim() === '' ||
      studentPass.trim() === '' ||
      studentNumber.trim() === ''
    ) {
      alert('Please fill in all student details for student ' + i);
      validationFailed = true;
      break; // Exit the loop on validation failure
    }

    // Add student data to the array
    students.push({
      student_reg:studentreg,
      student_name: studentName,
      student_mail: studentEmail,
      student_pass: studentPass,
      student_number: studentNumber,
    });
    
  }

  if(!validationFailed){
  // Create an object to hold the batch and student data
  const formData = {
    batch_number: batchNumber,
    students: students
  };

  // Send a POST request to the server using fetch
  fetch('/add_batch', {
    method: 'POST',
    body: JSON.stringify(formData),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        alert('Batch data and student details stored successfully!');
        setTimeout(function() {
          window.location.href = '/admin_main';
      }, 1000);
      } else {
        alert('Error storing batch data: ' + data.error);
      }
    });
  }

}


//to display add subjects form
function displayAddSub(){
  let add_subjects=document.getElementById("add_subjects");
  add_subjects.style.display='block';
  let main_btn=document.getElementById("main_btn");
  main_btn.style.display='none';

}

function addSub(){
  let sub_name=document.getElementById("subject_name").value;
  let sub_code=document.getElementById("subject_code").value;
  let selected_sem=document.getElementById("Sem_details").value;
  if(sub_name!=""&&sub_code!=""&&selected_sem!=-1){
    const formData = {
      sub_name: sub_name,
      sub_code: sub_code,
      selected_sem:selected_sem
      
    };
    fetch('/add_subjects', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
          'Content-Type': 'application/json'
      }
  })
  .then(response => response.json())
  .then(data => {
      if (data.success) {
          // Display a success message in an alert
          alert('New subject added successfully!');

          // Redirect to the success template after a brief delay
          setTimeout(function() {
              window.location.href = '/admin_main';
          }, 1000); // Delay for 2 seconds (adjust as needed)
      } else {
          alert('Error storing data:'+data.error);
      }
  });
  
  }
  else{
    alert("Select valid details");
  }

}

//to display subject allocation
 function displayAllocationForm(){
  let allocation_form=document.getElementById("allocation_form");
  fetch('/retrieve_sub')
.then(response => response.json())
.then(data => {
    let staff = data.staff;
    let student_batch = data.student_batch;
    let subjects = data.subjects;
    let Staff_available=document.getElementById("Staff_available");
    staff.forEach(staffName => {
      let option = document.createElement("option");
      option.value = staffName; // Set the option's value
      option.text = staffName;   // Set the text displayed in the dropdown
      Staff_available.add(option);
    });
    let batch_available=document.getElementById("batch_available");
    student_batch.forEach(batchName => {
      let option = document.createElement("option");
      option.value = batchName; // Set the option's value
      option.text = batchName;   // Set the text displayed in the dropdown
      batch_available.add(option);
    });
    let available_subjects=document.getElementById("available_subjects");
    subjects.forEach(subjectName => {
      let option = document.createElement("option");
      option.value = subjectName; // Set the option's value
      option.text = subjectName;   // Set the text displayed in the dropdown
      available_subjects.add(option);
    });
    })
    .catch(error => {
      console.error("Failed to fetch data from the Flask server:", error);
    });


  allocation_form.style.display='block';
  let main_btn=document.getElementById("main_btn");
  main_btn.style.display='none';
 }


 function subject_allocation(){
  let staff_selected=document.getElementById("Staff_available").value;
  let selected_batch=document.getElementById("batch_available").value;
  let selected_sub=document.getElementById("available_subjects").value;
  if(selected_sub!=-1&&selected_batch!=-1&&staff_selected!=-1){
    const formData = {
      selected_sub: selected_sub,
      selected_batch: selected_batch,
      staff_selected:staff_selected
      
    };
    fetch('/subject_allocation', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
          'Content-Type': 'application/json'
      }
  })
  .then(response => response.json())
  .then(data => {
      if (data.success) {
          // Display a success message in an alert
          alert('Subject Allocated successfully!');

          // Redirect to the success template after a brief delay
          setTimeout(function() {
              window.location.href = '/admin_main';
          }, 1000); // Delay for 2 seconds (adjust as needed)
      } else {
          alert('Error storing data:'+data.error);
      }
  });
  
  }
  else{
    alert("Select valid details");
  }
 }




function showpostQns(){
  fetch('/retrieve_sub')
  .then(response => response.json())
  .then(data => {
    let subjects = data.subjects;
    let batches = data.student_batch;
    let available_subjects=document.getElementById("sub");
    subjects.forEach(subjectName => {
      let option = document.createElement("option");
      option.value = subjectName;
      option.text = subjectName;
      available_subjects.add(option);
    });
    let available_batch=document.getElementById("available_batch");
    batches.forEach(batch => {
      let option = document.createElement("option");
      option.value = batch;
      option.text = batch;
      available_batch.add(option);
    });
});
  let postQns=document.getElementById("postQns");
  postQns.style.display='block';
  let staff_main_btn=document.getElementById("staff_main_btn");
  staff_main_btn.style.display="none";
}

function ready_qns(){
  console.log("function is called");
  const num_questions=document.getElementById("Questions_number").value;
  const num_options=document.getElementById("options_number").value;
  const container=document.getElementById("qn_container");
  const qn_form=document.getElementById("qn_form");
  let selectedBatch=document.getElementById("available_batch").value;
  let selectedSub=document.getElementById("sub").value;

  if (selectedBatch === "-1"||num_questions===""||num_options===""||selectedSub==="-1") {
    alert("Please select all details");
    return false;
}
  for (let i=1; i<=num_questions; i++){
      console.log("entered inside loop qn"+i);
      let label = document.createElement("label");
      label.textContent = (i)+":";
      
      let input = document.createElement("textarea");
      input.setAttribute("type", "text");
      input.setAttribute("name", "question-" + i);
      input.setAttribute("id", "question-" + i);
      label.setAttribute("for", "question-" + i);
      container.appendChild(label);
      container.appendChild(input);
      let br2 = document.createElement("br");
      container.appendChild(br2);
      for (let j = 1; j <= num_options; j++) {
          console.log("entered inside radio loop"+j);
          let radio = document.createElement("input");
          radio.setAttribute("type", "radio");
          radio.setAttribute("name", "rquestion-"+i);
          radio.setAttribute("id","rquestion-"+i+"-"+(j));

          radio.setAttribute("value", j);
          container.appendChild(radio);
          let radio_value=document.createElement("input");
          radio_value.setAttribute("type","text");
          radio_value.setAttribute("name","option_value-"+i+"-"+j)
          radio_value.setAttribute("id","option_value-"+i+"-"+j)
          container.appendChild(radio_value);
          let br3 = document.createElement("br");
          container.appendChild(br3);
      }

  }
  container.style.display="block";
  qn_form.style.display="none";
}

function final_form() {
  const container = document.getElementById("qn_container");
  let textAreas = container.getElementsByTagName("textarea");
  let inputs = container.getElementsByTagName("input");
  let num_questions=document.getElementById("Questions_number").value;
  let num_options=document.getElementById("options_number").value;
  let selectedBatch=document.getElementById("available_batch").value;
  let selectedSub=document.getElementById("sub").value;
  let isValid = true;
  let questionsData = [];

  for (let i = 0; i < textAreas.length; i++) {
      let textArea = textAreas[i];
      let value = textArea.value.trim();
      if (value === "") {
          isValid = false;
          alert("Please enter a question for question " + (i + 1) + ".");
          break;
        
      }
  }

  
  let q = textAreas.length; 
  let k = num_options; 
  for (let j = 0; j < inputs.length; j++) {
      let input = inputs[j];
      let type = input.getAttribute("type");
      if (type == "text") {
          let value = input.value.trim();
          if (value === "") {
              isValid = false;
              alert("Please enter an option for all question.");
              break;
          }
          k--; 
          if (k === 0) {
              k = num_options;
              q--;
          }
      } else if (type == "radio") {
          let radioGroup = document.querySelectorAll('input[name="' + input.getAttribute("name") + '"]');
          let radioChecked = Array.from(radioGroup).some(radio => radio.checked);
          if (!radioChecked) {
              isValid = false;
              alert("Please select an option for all question.");
              break;
          }
      }
  }

  // Convert to labels if valid
  if (isValid) {
    var options = [];
      alert("Everything is perfect");
      for(let qn=1;qn<=num_questions;qn++){
        let questionText=document.getElementById("question-"+qn).value;
        //console.log(qn+":"+ques);
        var selectedValue = null;
        for(opt=1;opt<=num_options;opt++){
          var radioButton = document.getElementById('rquestion-'+qn+'-'+opt);
          var optionText = document.getElementById('option_value-'+qn+'-'+opt).value;
          options.push(optionText);
          if (radioButton.checked) {
            selectedValue = radioButton.value;
        }
          console.log(opt+":"+optionText);
      
        }
        if (selectedValue !== null) {
          console.log("Selected Value: " + selectedValue);
      }
      questionsData.push({
        no : qn,
        question: questionText,
        options: options,
        answer: selectedValue,
        batch:selectedBatch,
        subject:selectedSub,
        no_opt:num_options
    });
      }
      console.log(questionsData);
      fetch('/staff_main/questions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ questions: questionsData })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
          
          alert('Questions posted successfully!');
          setTimeout(function() {
              window.location.href = '/staff_main';
          }, 1000);
      } else {
          alert('Error storing data:'+data.error);
      }
    });

  }
  
  
}


function view_assignments(){
  assignmet_form=document.getElementById("assesment")
  var username = new URLSearchParams(window.location.search).get("username");
  let view_assignment_btn=document.getElementById("view_assignment_btn");
  fetch('/student_main/show_quiz', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({username: username})
})
.then(response => response.json())
.then(data => {
  if (data.success)
  {
    if (data.value != "")
    {  
      
      
      let button = document.createElement("input");
      button.setAttribute("type", "button");
      button.setAttribute("value",data.value);
      button.setAttribute("id", "get_question");
      button.setAttribute("id", "get_question");
      button.setAttribute("class", "get_question");
      button.setAttribute("onclick", view_assignment());
      view_assignment_btn.style.display="none";
      let container = document.getElementById("assesment_details");
      container.append(button);

    }
    else{
      let container = document.getElementById("assesment_details");
      let label = document.createElement("label");
      label.textContent = "No Assignments Left!!"
      container.append(label);
    }
  }
  else{
    alert('Error retreving data:' + data.error);
  }

})
}

function view_assignment(){
  var username = new URLSearchParams(window.location.search).get("username");
  assignment_form=document.getElementById("assignment_details")
  let container=document.getElementById("assesment");
  fetch('/retrieve_quiz',{
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({username: username})
})
  .then(response => response.json())
  .then(data => {
    let questions = data.questions;
    let options = data.options;
    let selected_ans = data.selected_ans;
    let ques_len = data.no;
    /*console.log(questions);
    console.log(options);
    console.log(selected_ans);*/
    for (let i=0; i < ques_len; i++){
      console.log("entered inside loop qn"+i+1);
      let label = document.createElement("label");
      label.textContent = (i+1)+":";
      label.setAttribute("id","qn-"+(i+1))
      label.setAttribute("class","qn-no");
      let label_ques = document.createElement("label");
      label_ques.textContent = questions[i];
      label_ques.setAttribute("class","question");
      container.appendChild(label);
      container.appendChild(label_ques);
      let br2 = document.createElement("br");
      container.appendChild(br2);
      let optionValues = options[i].split(',');
      console.log(optionValues);
      for(let j=1;j<=optionValues.length;j++){
        console.log(optionValues);
        let radio=document.createElement("input");
        radio.setAttribute("type","radio");
        radio.setAttribute("value",j);
        radio.setAttribute("id","qn-"+i+"-opt"+j);
        radio.setAttribute("name","options-"+(i+1));
        let optLabel=document.createElement("label");
        optLabel.textContent=optionValues[j-1];
        
      optLabel.setAttribute("class","option");
        container.appendChild(radio);
        container.appendChild(optLabel);
        let br2 = document.createElement("br");
        container.appendChild(br2);
      }   
      }

  });
  let submit_answers=document.getElementById("submit_answers");
  submit_answers.style.display="block";
  let view_assignment_btn=document.getElementById("view_assignment_btn");
  view_assignment_btn.style.display="none";
  }

  function store_result() {
    var username = new URLSearchParams(window.location.search).get("username");
  
    // Fetch selected answers from radio buttons
    
    // Fetch quiz data from the '/retrieve_quiz' endpoint
    fetch('/retrieve_quiz', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username
      })
    })
    .then(response => response.json())
    .then(data => {let selectedAns = [];
      for (let i = 1; i <= data.no; i++) {
        let radioButtons = document.getElementsByName("options-" + i);
        let selectedValue = Array.from(radioButtons).find(rb => rb.checked)?.value;
        if (selectedValue === undefined) {
          alert('Please select an option for all questions before submitting.');
          return; // Exit the function without submitting the form
        }
        selectedAns.push(selectedValue);
      }
    
      // Data retrieval successful, now perform result calculation
  
      // Calculate total number of correct answers
      let correctAnswers = 0;
      for (let i = 0; i < data.no; i++) {
        // Assuming data.correct_ans contains correct answers (modify as needed)
        if (String(selectedAns[i]) === String(data.selected_ans[i])) {
          correctAnswers++;
        }
      }
  
      console.log("Correct Answers:", correctAnswers);
      console.log("Total Questions:", data.no);
  
      // Calculate marks obtained and total marks
      let marksObtained = correctAnswers;
      let totalMarks = data.no;
  
      // Fetch API to send data to the '/store_response' endpoint
      fetch('/store_response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: username,
          selectedAns: selectedAns,
          marksObtained: marksObtained,
          totalMarks: totalMarks,
          subject: data.subject
        })
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert('Response stored successfully! Correct answers: ' + correctAnswers);
          setTimeout(function () {
            window.location.href = '/student_main';
          }, 1000);
        } else {
          alert('Error storing data: ' + data.error);
        }
      })
      .catch(error => {
        console.error('Error during fetch:', error);
      });
    })
    .catch(error => {
      console.error('Error retrieving quiz data:', error);
    });
  }
  


  function view_results() {
    var username = new URLSearchParams(window.location.search).get("username");
    let staff_main_btn=document.getElementById("staff_main_btn");
    let result_form=document.getElementById("result_form");
    let table = document.getElementById("result_table");
    fetch("/result_staff", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username })
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {   
          console.log(data.regno);
          console.log(data.subject);
          console.log(data.marks);
          console.log(data.total);       
          for (var i = 0; i < data.regno.length; i++) {
            var row = table.insertRow();
  
            // Insert cells into the row
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);
            var cell4 = row.insertCell(3);
  
            // Populate cells with data
            cell1.innerHTML = data.regno[i];
            cell2.innerHTML = data.subject[0];
            cell3.innerHTML = data.marks[i][0];
            cell4.innerHTML = data.total[i][0];
          }
        } else {
          alert(data.error);
        }
      })
      .catch(error => {
        console.error('Error during fetch operation:', error);
        alert('Error during fetch operation. Please check the console for details.');
      });
      result_form.style.display="block";
      staff_main_btn.style.display="none";

  }
  