import React, { useState, useEffect } from 'react';
import marked from "marked";
import "../static/css/addArticle.css";
import { Row, Col, Input, Select, Button, DatePicker, message } from 'antd';
import axios from 'axios';
import servicePath from '../config/servicePath';
const { Option } = Select;
const { TextArea } = Input;
marked.setOptions({
  renderer: marked.Renderer(),
  gfm: true,
  pedantic: false,
  sanitize: false,
  tables: false,
  breaks: false,
  smartLists: false,
  smartypants: false
})
function AddArticle(props) {
  const [articleId, setArticleId] = useState(0) // 文章ID，如果是0说明是新增，不是0是修改
  const [articleTitle, setArticleTitle] = useState('') //文章标题
  const [articleContent, setArticleContent] = useState('') //文章内容
  const [markdownContent, setMarkdownContent] = useState('') // markDown的编辑内容
  const [introducemd, setIntroduemd] = useState('') // 简介markdown内容
  const [introducehtml, setIntroduehtml] = useState('等待编辑') //简介的html内容
  const [showDate, setShowDate] = useState() // 发布日期
  const [updateDate, setUpdateDate] = useState() //修改日期
  const [typeInfo, setTypeInfo] = useState([]) // 文章类别信息
  const [selectedType, setSelectedType] = useState(1) // 选择的文章类别

  // 得到文字类别信息
  const getTypeInfo = () => {
    axios({
      method: 'get',
      url: servicePath.getTypeInfo,
      headers: { 'Access-Control-Allow-Origin': '*' },
      withCredentials: true
    }).then(res => {
      if (res.data.data === '没有登录') {
        localStorage.removeItem('openId');
        props.history.push('/')
      } else {
        setTypeInfo(res.data.data);
        setSelectedType(res.data.data[0].id);
      }
    })
  }
  // 得到文章详情
  const getArticleDetail = (id) => {
    axios({
      method: 'get',
      withCredentials: true,
      url: servicePath.getArticleDetail + id
    }).then(res => {
      // console.log(res)
      // const result = res.data;
      // console.log(result)
      if (result.success == true) {
        setArticleTitle(result.data.title);
        setShowDate(result.data.addTime);
        changeContent(result.data.article_content);
        changeIntroduce(result.data.introduce)
        setSelectedType(result.data.type_id);
      }
    })
  }
  const changeContent = (value) => {
    setArticleContent(value)
    let html = marked(value);
    setMarkdownContent(html);
  }

  const changeIntroduce = (value) => {
    setIntroduemd(value)
    let html = marked(value);
    setIntroduehtml(html);
  }
  const selectTypeHandler = (e) => {
    setSelectedType(e)
  }
  const saveArticle = () => {
    if (!selectedType) {
      message.error('必须选择文章类型')
      return false;
    } else if (!articleTitle) {
      message.error('文章名称不能为空')
      return false;
    } else if (!introducemd) {
      message.error('文章内容不能为空')
      return false;
    } else if (!showDate) {
      message.error('发布时间不能为空')
      return false
    }
    let dataProps = {} // 传递到接口的参数
    dataProps.type_id = selectedType;
    dataProps.title = articleTitle;
    dataProps.article_content = articleContent;
    dataProps.introduce = introducemd;
    if (articleId === 0) {
      let dateText = showDate.replace('-', '/');
      dataProps.addTime = (new Date(dateText).getTime()) / 1000;
      dataProps.view_count = Math.ceil(Math.random() * 100) + 1000;
      dataProps.updateTime = updateDate;
      axios({
        method: 'post',
        url: servicePath.addArticle,
        data: dataProps,
        withCredentials: true
      }).then(res => {
        setArticleId(res.data.insertId);
        if (res.data.isSuccess) {
          message.success('文章保存成功')
        } else {
          message.error('文章保存失败')
        }
      })
    } else {
      dataProps.id = articleId;
      dataProps.addTime = showDate;
      let dateText = updateDate.replace('-', '/');
      dataProps.view_count = Math.ceil(Math.random() * 100) + 1000;
      dataProps.updateTime = (new Date(dateText).getTime()) / 1000;
      axios({
        method: 'post',
        url: servicePath.updateArticle,
        data: dataProps,
        withCredentials: true
      }).then(res => {
        // setArticleId(res.data.isSuccess);
        if (res.data.isSuccess) {
          message.success('文章更新成功')
        } else {
          message.error('文章更新失败')
        }
      })
    }
    // message.success('校验通过')
  }
  useEffect(() => {
    const id = props.match.params.id;
    if (id) {
      getArticleDetail(id);
      setArticleId(id);
    } else {
      setArticleId(0)
    }
    getTypeInfo()
  }, [])
  return (
    <div>
      <Row gutter={5}>
        <Col pan={18}>
          <Row gutter={10}>
            <Col span={20}>
              <Input placeholder="博客标题" value={articleTitle} onChange={e => setArticleTitle(e.target.value)} size="large" />
            </Col>
            <Col span={4}>
              &nbsp;
              <Select defaultValue={selectedType} onChange={selectTypeHandler} size="large">
                {
                  typeInfo.map((item, index) => {
                    return (<Option value={item.id} key={index}>{item.typeName}</Option>)
                  })
                }

              </Select>
            </Col>
          </Row>
          <br />
          <Row gutter={10}>
            <Col span={12}>
              <TextArea className="markdown-content" value={articleContent} onChange={(e) => changeContent(e.target.value)} rows={31} placeholder="文章内容" />
            </Col>
            <Col span={12}>
              <div className="show-html" dangerouslySetInnerHTML={{ __html: markdownContent }} ></div>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <br />
          <TextArea rows={4} placeholder="文章简介" value={introducemd} onChange={(e) => changeIntroduce(e.target.value)} />
          <br /> <br />
          <div className="introduce-html" dangerouslySetInnerHTML={{ __html: introducehtml }}></div>
          <br />
        </Col>
        {
          articleId == 0 ?
            (
              <Col span={12}>
                <div className="data-select">
                  <DatePicker onChange={(data, dataString) => setShowDate(dataString)} placeholder='发布日期' size="large" />
                </div>
                <br />
              </Col>
            ) :
            <Col span={12}>
              <div className="data-select">
                <DatePicker onChange={(data, dataString) => setUpdateDate(dataString)} placeholder='修改时间' size="large" />
              </div>
              <br />
            </Col>
        }

        <Col span={24}>
          <Row>
            <Col span={24}>
              <Button size="large">暂存文章</Button>&nbsp;
              <Button type="primary" onClick={saveArticle} size="large">保存文章</Button>
              <br />
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  )
}
export default AddArticle;