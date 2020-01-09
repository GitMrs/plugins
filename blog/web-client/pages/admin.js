import Head from "next/head";
import Header from "../components/header";
import { Row, Col } from "antd";
import "../static/style/pages/admin.css";
const Admin = () => (
  <>
    <Head>
      <title>博客编写</title>
    </Head>
    <Header />
    <Row className="comm-main" type="flex" justify="center">
      <Col xs={24} sm={24} lg={18} md={16} xl={14}>
        <h3 className="admin-title">编写</h3>

      </Col>
    </Row>
  </>
)
export default Admin;
