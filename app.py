from flask import Flask, render_template, request, jsonify,redirect,url_for
import mysql.connector,traceback

app = Flask(__name__)

app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'Crazieeaadhi@02'
app.config['MYSQL_DB'] = 'quiz_app'
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_PORT'] = 3306

# Manually set up the MySQL connection
mysql_connection = mysql.connector.connect(
    user=app.config['MYSQL_USER'],
    password=app.config['MYSQL_PASSWORD'],
    database=app.config['MYSQL_DB'],
    host=app.config['MYSQL_HOST'],
    port=app.config['MYSQL_PORT']
)

app.secret_key = 'your_secret_key'


@app.route('/')
def navbar():
    return render_template('navbar.html')

@app.route('/admin_login', methods = ['GET'])
def admin_login():
    return render_template('admin_login.html')

@app.route('/staff_login', methods = ['GET'])
def staff_login():
    return render_template('staff_login.html')



@app.route('/admin_authenticate', methods = ['POST'])
def admin_authenticate():
    
    username = request.form['username']
    password = request.form['password']
    cursor = mysql_connection.cursor()
    cursor.execute("SELECT * from staff_login where username=%s and user_password=%s and isadmin=1", (username, password))
    data = cursor.fetchone()

    if data is None:
        return  redirect(url_for('admin_login'))
    else:
        return redirect(url_for('admin_main'))


@app.route("/staff_authenticate", methods=['POST'])
def staff_authenticate():
    username = request.form['username']
    password = request.form['password']
    cursor = mysql_connection.cursor()
    cursor.execute("SELECT * from staff_login where username=%s and user_password=%s and isadmin=0", (username, password))
    data = cursor.fetchone()

    if data is None:
        return  redirect(url_for('staff_login'))
    else:
        return redirect(url_for('staff_main',username=username))


@app.route('/stud_login', methods = ['GET'])
def stud_login():
    return render_template('student_login.html')

@app.route("/student_authenticate", methods=['POST'])
def student_authenticate():
    username = request.form['username']
    password = request.form['password']
    cursor = mysql_connection.cursor()
    cursor.execute("SELECT * from student_details where regno=%s and student_password=%s", (username, password))
    data = cursor.fetchone()

    if data is None:
        return  redirect(url_for('stud_login'))
    else:
        return redirect(url_for('student_main',username=username))

@app.route('/student_main', methods = ['GET','POST'])
def student_main():
    
    return render_template('student_main.html')

@app.route('/staff_main', methods=['GET','POST'])
def staff_main():
    return render_template('staff_main.html')

@app.route('/staff_main/questions', methods=['POST','GET'])
def store_questions():
    try:
        data = request.get_json()
        questions = data.get('questions')
        print(questions)
        opt=int(questions[0]['no_opt'])
        print(opt)
        cursor = mysql_connection.cursor()
        a,b=0,opt
        for question in questions:
            no = question['no']
            subject = question['subject']
            question_text = question.get('question')
            options = question.get('options')
            options_text=",".join(options[a:b])
            answer = question.get('answer')
            batch = question['batch']
        
            cursor.execute('INSERT INTO quiz_questions (num, ques, opt, selected_val, sub, batch, result) VALUES (%s, %s, %s, %s, %s, %s, 0)', (no, question_text, options_text, answer, subject, batch))
            a+=opt
            b+=opt
        cursor.execute('SELECT reg_no FROM batch_info WHERE batch_id = %s', (batch,))
        reg_value=[row[0] for row in cursor.fetchall()]
        for reg in reg_value:
            cursor.execute('INSERT INTO student_response(reg_no, sub, batch, response) VALUES(%s, %s, %s, 0)', (reg, subject, batch) )
        mysql_connection.commit()
        cursor.close()
        return jsonify({'success': True})

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})



@app.route('/admin_main', methods=['GET','POST'])
def admin_main():
    return render_template('admin_main.html')

@app.route('/store_staff_data', methods=['POST'])
def store_staff_data():
    try:
        data = request.get_json()
        username = data['staff_name']
        staff_email = data['staff_email']
        staff_pass = data['staff_pass']
        staff_num = data['staff_num']

        cursor = mysql_connection.cursor()
        cursor.execute("INSERT INTO staff_login (username,user_password,email,phone,isadmin) VALUES (%s, %s, %s, %s,0)", (username, staff_pass, staff_email, staff_num))

        mysql_connection.commit()  # Commit the changes to the database
        cursor.close()

        return jsonify({'success': True})

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})


@app.route('/add_batch', methods=['POST'])
def add_batch():
    try:
        data = request.get_json()
        batch_number = data['batch_number']
        students = data['students']
        total = len(students)
        cursor = mysql_connection.cursor()
        for i in range(1, total + 1):
            student = students[i - 1]
            student_reg = student['student_reg']
            student_name = student['student_name']
            student_mail = student['student_mail']
            student_pass = student['student_pass']
            student_number = student['student_number']
            cursor.execute("SELECT batch_id from batch")
            batch_value=[row[0] for row in cursor.fetchall()]
            if batch_number not in batch_value:
                cursor.execute("INSERT INTO batch(batch_id) VALUES(%s)",(batch_number,))
            cursor.execute("INSERT INTO batch_info(batch_id, reg_no) VALUES(%s, %s)",(batch_number, student_reg))
            cursor.execute(
                "INSERT INTO student_details (regno, student_name, student_password, mail, phone, batch) VALUES (%s, %s, %s, %s, %s, %s)",
                (student_reg, student_name, student_pass, student_mail, student_number, batch_number)
            )
            mysql_connection.commit()
        cursor.close()
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/add_subjects', methods=['POST'])
def add_subject():
    try:
        data = request.get_json()
        sub_name = data['sub_name']
        sub_code = data['sub_code']
        selected_sem = data['selected_sem']

        # Validate the data (you can reuse the same validation logic used in the JavaScript)
        cursor = mysql_connection.cursor()
        cursor.execute("INSERT INTO subjects (subject_name,subject_code,sem) VALUES (%s, %s, %s)", (sub_name,sub_code,selected_sem))

        mysql_connection.commit()  # Commit the changes to the database
        cursor.close()

        return jsonify({'success': True})

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})


@app.route("/retrieve_sub", methods=['GET'])
def retrievesub():
    cursor = mysql_connection.cursor()
    cursor.execute("SELECT username from staff_login")
    staff=[row[0] for row in cursor.fetchall()]
    cursor.execute("SELECT batch_id from batch")
    student_batch=[row[0] for row in cursor.fetchall()]
    cursor.execute("SELECT subject_name from subjects")
    subjects=[row[0] for row in cursor.fetchall()]

    cursor.close()
    return jsonify({
        "staff": staff,
        "student_batch": student_batch,
        "subjects": subjects
    })

@app.route("/subject_allocation", methods=['POST'])
def subject_allocation():
    try:
        data = request.get_json()
        selected_sub = data['selected_sub']
        selected_batch = data['selected_batch']
        staff_selected = data['staff_selected']

        # Validate the data (you can reuse the same validation logic used in the JavaScript)
        cursor = mysql_connection.cursor()
        cursor.execute("INSERT INTO sub_alloc (staff,selected_subject,batch) VALUES (%s, %s, %s)", (staff_selected,selected_sub,selected_batch))

        mysql_connection.commit()  # Commit the changes to the database
        cursor.close()

        return jsonify({'success': True})

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/student_main/show_quiz', methods=['GET', 'POST'])
def show_quiz():
    try:
        data = request.get_json()
        username = data['username']
        cursor = mysql_connection.cursor()

        cursor.execute("SELECT response from student_response WHERE reg_no = %s", (username,))
        response_quiz = cursor.fetchall()

        if not response_quiz[0][0]:
            cursor.execute("SELECT sub from student_response WHERE reg_no = %s and response = 0", (username,))
            subjects = cursor.fetchall()
            print(subjects)
            mysql_connection.commit()
            cursor.close()

            return jsonify({'success': True, 'value': subjects if subjects else []})
        else:
            return jsonify({'success': True, 'value': []})
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})


@app.route('/retrieve_quiz', methods = ['POST', 'GET'])
def retrive_quiz():
    try:
        data = request.get_json()
        username = data['username']
        cursor = mysql_connection.cursor()
        cursor.execute("SELECT response from student_response WHERE reg_no = %s", (username,))
        response_quiz = cursor.fetchall()
        print(response_quiz)
        if(response_quiz[0][0]==0):
            cursor.execute("SELECT sub from student_response WHERE reg_no = %s and response = 0", (username,))
            subject = cursor.fetchall()
            print(subject[0][0])
        cursor.execute("SELECT ques from quiz_questions WHERE sub = %s", (subject[0][0],))
        questions = [row[0] for row in cursor.fetchall()]
        cursor.execute("SELECT opt from  quiz_questions where sub=%s",(subject[0][0],))
        option=cursor.fetchone()
        option_len=len(option)
        cursor.fetchall()
        print(option_len)
        cursor.execute("SELECT opt from quiz_questions WHERE sub = %s", (subject[0][0],))
        options = [row[0] for row in cursor.fetchall()]
        cursor.execute("SELECT selected_val from quiz_questions WHERE sub = %s", (subject[0][0],))
        print(options)
        selected_ans = [row[0] for row in cursor.fetchall()]
        cursor.execute("SELECT MAX(num) FROM quiz_questions WHERE sub = %s", (subject[0][0],))
        max_question_number = cursor.fetchone()[0] or 0
        cursor.close()
        return jsonify({
            "no":max_question_number,
            "questions": questions,
            "options": options,
            "selected_ans": selected_ans,
            "subject":subject[0][0]
        })
    except Exception as e:
        return jsonify({"error": str(e)}, 500) 

from flask import request, jsonify

@app.route('/store_response', methods=['POST'])
def store_response():
    try:
        data = request.get_json()
        username = data['username']
        selected_ans = data['selectedAns']
        marks_obtained = data['marksObtained']
        total_marks = data['totalMarks']
        subject = data['subject']

        if username is None:
            return jsonify({'success': False, 'error': 'Username cannot be null'})

        question_nos = list(range(1, len(selected_ans) + 1))

        # Join the answers into a single string
        answer_str = ', '.join(map(str, selected_ans))
        question_nos_str = ', '.join(map(str, question_nos))
        print("SQL Query:", 'UPDATE student_response SET response = 1 WHERE reg_no = %s', (username,))
        print("Username:", username)
        
        cursor = mysql_connection.cursor()
        cursor.execute('INSERT INTO result (regno, question_no, selected_answer, marks_obtained, total_marks, sub) VALUES (%s, %s, %s, %s, %s, %s)',
                       (username, question_nos_str, answer_str, marks_obtained, total_marks, subject))
        cursor.execute('UPDATE student_response SET response = 1 WHERE reg_no = %s', (username,))
        mysql_connection.commit()
        cursor.close()
        return jsonify({'success': True})

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})



@app.route("/result_staff", methods=["POST"])
def resultStaff():
    try:
        data = request.get_json()
        username = data.get('username')
        if not username:
            raise ValueError("Username is missing in the request.")

        marks = []
        total = []

        with mysql_connection.cursor() as cursor:
            print(username)
            cursor.execute("SELECT selected_subject FROM sub_alloc WHERE staff=%s", (username,))
            subject = cursor.fetchone()
            cursor.fetchall()
            print(subject[0])

            cursor.execute("SELECT reg_no FROM student_response WHERE response = 1 and sub=%s", (subject[0],))
            student_result = cursor.fetchall()
            students = [row[0] for row in student_result]
            #cursor.fetchall()
            print(students)

            for student in students:
                cursor.execute("SELECT marks_obtained FROM result WHERE regno=%s and sub=%s", (student,subject[0],))
                mark = cursor.fetchone()
                print(mark)
                marks.append(mark)
                cursor.execute("SELECT total_marks FROM result WHERE regno=%s and sub=%s", (student,subject[0],))
                total_mark = cursor.fetchone()
                total.append(total_mark)
                #cursor.fetchall()
                print(marks)
                print(total)

        return jsonify({'success': True, "regno": students, "subject": subject, "marks": marks, "total": total})

    except ValueError as ve:
        app.logger.error("An error occurred: %s", str(ve))
        return jsonify({'success': False, 'error': str(ve)})

    except Exception as e:
        app.logger.error("An error occurred: %s", str(e))
        traceback.print_exc()
        return jsonify({'success': False, 'error': 'An error occurred while processing the request.'})






if __name__ == "__main__":
    app.run(debug=True, port=5001)
    







