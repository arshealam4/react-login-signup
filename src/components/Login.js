import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import config from '../config/config'
import loader from '../images/loader.gif';

// header component
class Login extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isSubmit: false,
      isError: false,
      msg: ''
    }
  }

  showHideMsg(result){
    this.setState({
      isSubmit: false,
      isError: true,
      msg: result.data.msg || 'internel server error!'
    });
    setTimeout(() => {
      this.setState({
        isError: false
      });
    }, 2000)
  }


  render() {
    const LoginSchema = Yup.object().shape({
        email: Yup.string()
          .email('Invalid email')
          .required('email required'),
        password: Yup.string()
          .min(2, 'Too Short!')
          .max(50, 'Too Long!')
          .required('password required'),
      });


    return (
    <div>
    <Formik
      initialValues={{
        email: '',
        password: '',
      }}
      validationSchema={LoginSchema}

      onSubmit={async (values) => {
        this.setState({
          isSubmit: true
        });
        let result;
        try {
          result = await axios.post(config.backendAPI + `/users/login`, { values });
          if (result.data.success) {
            // set user info in localstorage and send to home page
            localStorage.setItem('user', JSON.stringify(result.data))
            this.props.history.push("/home");
          } else {
            this.showHideMsg(result);
          }
        } catch(err) {
          this.showHideMsg(result);
        }

      }}
    >
      {({ errors, touched }) => (
        <div className="container">
          <h2>Login</h2>
        <Form>
          <div className="form-group">
            <label className="control-label col-sm-4">Email:</label>
            <div className="col-sm-8">
              <Field className="form-control" name="email" type="text" />
                {errors.email && touched.email ? (<div className="text-danger">{errors.email}</div>) : null}
            </div>
          </div>

          <div className="form-group">
          <label className="control-label col-sm-4">Password:</label>
              <div className="col-sm-8">
                <Field className="form-control" name="password" type="password" />
                {errors.password && touched.password ? (<div className="text-danger">{errors.password}</div>) : null}
              </div>
          </div>
          
          <div className="form-group">
            <div className="col-sm-offset-2 col-sm-10">
              <button className="btn btn-success" type="submit" disabled={this.state.isSubmit}>Submit</button>
              {this.state.isSubmit ? (<img src={loader} alt="loader"/>) : (<i></i>) }
            </div>
          </div>

          {this.state.isError ? (<div className="alert alert-danger">
            <strong>ERROR!</strong> {this.state.msg}
          </div>) : (<i></i>) }

          <div className="form-group">
            <div className="col-sm-offset-2 col-sm-10">
              <button className="btn btn-default" type="button"><Link to={'/signup'}>Signup</Link></button>
            </div>
          </div>

        </Form>
        </div>
      )}
    </Formik>

  </div>
  
    );
  }
}

export default Login;
