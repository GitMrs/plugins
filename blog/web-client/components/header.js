import React, { useState, useEffect } from "react";
import Router from 'next/router';
import Link from "next/link";
import axios from 'axios';
import servicePath from '../config/apiUrl';
import '../static/style/component/header.css';
import { Row, Col, Menu, Icon } from 'antd';


const Header = () => {
  const [navArray, setNavArray] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(servicePath.getTypeInfo).then(
        (res) => {
          setNavArray(res.data.data)
          return res.data.data;
        }
      )
      setNavArray(result)
    }
    fetchData()
  }, []);

  //跳转列表页
  const handleClick = (e) => {
    if (e.key == 0) {
      Router.push('/index')
    } else {
      Router.push('/list?id=' + e.key)
    }
  }
  return (<div className="header">
    <Row type="flex" justify="center">
      <Col xs={24} sm={24} md={10} lg={15} xl={12}>
        <span className="header-logo">无名草</span>
        <span className="header-text">默默无闻</span>
      </Col>
      <Col className="menu-div" xs={0} sm={0} md={14} lg={8} xl={6}>
        <Menu
          mode="horizontal"
          onClick={handleClick}
        >
          <Menu.Item key="0">
            <Icon type="home"></Icon>
            博客首页
          </Menu.Item>
          {
            navArray.map((item) => {
              return (
                <Menu.Item key={item.id}>
                  <Icon type={item.icon} />
                  {item.typeName}
                </Menu.Item>
              )
            })
          }
          {/* <Menu.Item key="video" >
            <a href="/list">
              <Icon type="youtube"></Icon>
              视频
            </a>
          </Menu.Item>
          <Menu.Item key="life">
            <Icon type="smile"></Icon>
            生活
          </Menu.Item>
          <Menu.Item key="user">
            <a href="/admin">
              <Icon type="user"></Icon>
              Admin
            </a>
          </Menu.Item>
         */}
        </Menu>
      </Col>
    </Row>
  </div>)
}
export default Header;
