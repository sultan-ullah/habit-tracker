import * as React from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, Col, Row } from "antd";

export default function LoginDialog() {
  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };

  return (
    <>
    <Row>
      <Col span={8} offset={8}>
       <h1>
          Habit Time Tracker
       </h1>
      </Col>
    </Row>
    <Row>
      <Col span={8} offset={8}>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Username required" }]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Username"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Password required" }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Log in
            </Button>&nbsp;
            Or <a href="">sign up now!</a>
          </Form.Item>
        </Form>
      </Col>
      </Row>
      </>
  );
}
