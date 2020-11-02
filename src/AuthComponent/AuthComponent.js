import React, { Component } from "react";
import { Redirect, withRouter } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "react-bootstrap";
import { URL } from "../Redux/constants"

export default function AuthComponent(ComponentToProtect) {
    const dispatch = useDispatch();
    const jwt_token = useSelector((state) => state.jwt_token);

    class Auth extends Component {
        constructor(props) {
            super(props);
            this.state = {
                loading: true,
                redirect: false,
            };
        }
        componentDidMount() {
            axios({
                method: "post",
                url: `${URL}/verify`,
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${jwt_token}`,
                },
            })
                .then((res) => {
                    if (res.data.status == "valid") {
                        this.setState({ loading: false, redirect: false });
                    } else {
                        this.setState({
                            loading: false,
                            redirect: true,
                        });
                    }
                })
                .catch((err) => {
                    console.error(err);
                    this.setState({ loading: false, redirect: true });
                });
        }
        render() {
            const { loading, redirect } = this.state;
            if (loading) {
                return (
                    <React.Fragment>
                        <div className={"d-flex justify-content-center spinner-center"}>
                            <Spinner animation="border" />
                        </div>
                    </React.Fragment>
                );
            }
            if (redirect) {
                return (
                    <Redirect
                        to={{
                            pathname: "/logout",
                        }}
                    />
                );
            }
            return (
                <ComponentToProtect
                    {...this.props}
                />
            );
        }
    }

    return withRouter(Auth);
}
