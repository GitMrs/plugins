import React, { useEffect, useState } from 'react';
import { List, Row, Col, Modal, message, Button, Switch } from 'antd';
import axios from 'axios';
import servicePath from '../config/servicePath';
import '../static/css/articleList.css';
const { confirm } = Modal;

function ArticleList(props) {
  const [list, setList] = useState([]);
  const getList = () => {
    axios({
      method: 'get',
      withCredentials: true,
      url: servicePath.getArticle
    }).then(res => {
      setList(res.data.data)
      console.log(res)
    })
  }
  const delArticle = (id) => {
    confirm({
      title: '是否确认删除？',
      content: '如果你点击OK按钮，文章将会永远被删除，无法恢复。',
      onOk: () => {
        axios({
          method: 'get',
          withCredentials: true,
          url: servicePath.deleteArticle + id,
        }).then(res => {
          if(res.data.success === true){
            message.success('删除成功！')
            getList()
          }else{
            message.error('网络异常！')
          }
        })
      },
      onCancel: () => {
        message.success('取消成功！')
      }
    })
  }
  const editArticle = (id) => {
    props.history.push(`/index/add/${id}`)
  }
  useEffect(() => {
    getList()
  }, [])
  return (
    <div>
      <List
        header={
          <Row className="list-div">
            <Col span={8}>
              <b>标题</b>
            </Col>
            <Col span={3}><b>类别</b> </Col>
            <Col span={4}><b>发布时间</b> </Col>
            <Col span={3}><b>浏览量</b> </Col>
            <Col span={6}><b>操作</b> </Col>
          </Row>
        }
        bordered
        dataSource={list}
        renderItem={item => {
          return (<List.Item>
            <Row className="list-div">
              <Col span={8}>{item.title}</Col>
              <Col span={3}>{item.typeName}</Col>
              <Col span={4}>{item.addTime}</Col>
              <Col span={3}>{item.view_count}</Col>
              <Col span={6}>
                <Button type="primary" onClick={() => delArticle(item.id)}>删除</Button> &nbsp;
                <Button onClick={() => editArticle(item.id)}>修改</Button>
              </Col>
            </Row>
          </List.Item>)
        }}
      ></List>

    </div>
  )
}
export default ArticleList;