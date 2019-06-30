import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import config from '../config/config'
import loader from '../images/loader.gif';

// header component
class Signup extends Component {

  constructor() {
    super();

    this.state = {
      isSubmit: false,
      isSuccess: false,
      isError: false,
      msg: ''
    }

  }

  resetAll() {
    setTimeout(() => {
      this.setState({
        isSubmit: false,
        isSuccess: false,
        isError: false,
        msg: ''
      })
    }, 1500);
  }

  render() {
    const SignupSchema = Yup.object().shape({
        userName: Yup.string()
          .min(2, 'Too Short!')
          .max(50, 'Too Long!')
          .required('username required'),
        email: Yup.string()
          .email('Invalid email')
          .required('email required'),
        gender: Yup.string()
          .required('gender required'),
        password: Yup.string()
          .min(2, 'Too Short!')
          .max(50, 'Too Long!')
          .required('password required'),
        passwordConfirm: Yup.string()
          .oneOf([Yup.ref('password'), null], "Passwords must match")
          .required('confirm password required')
      });

    return (
    <div>
    <Formik
      initialValues={{
        userName: '',
        email: '',
        gender: '',
        password: '',
        passwordConfirm: ''
      }}
      validationSchema={SignupSchema}

      onSubmit={async (values, {resetForm}) => {
        this.setState({
          isSubmit: true
        });

        try {
          let result = await axios.post(config.backendAPI + `/users/signup`, { values });
          if (result.data.success) {
            this.setState({
              isSubmit: false,
              isSuccess: true,
              msg: result.data.msg || 'Your registeration has been done successfully!'
            });
            this.resetAll();
            resetForm();
          } else {
            this.setState({
              isSubmit: false,
              isError: true,
              msg: result.data.msg || 'There is some issue, Please try again!'
            });
            this.resetAll();
          }
        } catch(err) {
          this.setState({
            isSubmit: false,
            isError: true,
            msg: err.msg || 'internel server error!'
          });
          this.resetAll();
        }

      }}
    >
      {({ errors, touched }) => (
        <div className="container">
          <h2>Signup</h2>
        <Form>
          <div className="form-group">
          <label className="control-label col-sm-4">User Name:</label>
          <div className="col-sm-8">
            <Field className="form-control" name="userName" type="text" />
              {errors.userName && touched.userName ? (<div className="text-danger">{errors.userName}</div>) : null}
            </div>
          </div>

          <div className="form-group">
            <label className="control-label col-sm-4">Email:</label>
            <div className="col-sm-8">
              <Field className="form-control" name="email" type="text" />
                {errors.email && touched.email ? (<div className="text-danger">{errors.email}</div>) : null}
            </div>
          </div>

          <div className="form-group">
            <label className="control-label col-sm-4">Gender:</label>
              <div className="col-sm-8">
                <Field className="form-control" component="select" name="gender">
                  <option value='null'>Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </Field>
              {errors.gender && touched.gender ? (<div className="text-danger">{errors.gender}</div>) : null}
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
          <label className="control-label col-sm-4">Confirm Password:</label>
              <div className="col-sm-8">
                <Field className="form-control" name="passwordConfirm" type="password" />
                {errors.passwordConfirm && touched.passwordConfirm ? (<div className="text-danger">{errors.passwordConfirm}</div>) : null}
              </div>
          </div>

          <div className="form-group">
            <div className="col-sm-offset-2 col-sm-10">
              <button className="btn btn-success" type="submit" disabled={this.state.isSubmit}>Submit</button>
              {this.state.isSubmit ? (<img src={loader} alt="loader"/>) : (<i></i>) }
            </div>
          </div>

          {this.state.isSuccess ? (<div className="alert alert-success">
            <strong>SUCCESS!</strong> {this.state.msg}
          </div>) : (<i></i>) }

          {this.state.isError ? (<div className="alert alert-danger">
            <strong>ERROR!</strong> {this.state.msg}
          </div>) : (<i></i>) }

          <div className="form-group">
            <div className="col-sm-offset-2 col-sm-10">
              <button className="btn btn-default" type="button"><Link to={'/login'}>Login</Link></button>
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

export default Signup;
