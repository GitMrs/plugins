import React from 'react';
import Head from 'next/head';
import axios from 'axios';
import Link from 'next/link';
import { Row, Col, Breadcrumb, Icon, Affix } from "antd";
import ReactMarkdowm from 'react-markdown'; //使用react-markdown
import MarkNav from 'markdown-navbar'; // markdown 的导航
import Header from '../components/header';
import '../static/style/pages/detailed.css';
import 'markdown-navbar/dist/navbar.css';
import markdown from './markDown.js';
import servicePath from '../config/apiUrl';
// import Tocify from '../components/tocify';
// import marked from 'marked'
// import hljs from "highlight.js";
// import 'highlight.js/styles/monokai-sublime.css';
const Detail = (list) => {

  //使用Tocify
    // const tocify = new Tocify();
    // const renderer = new marked.Renderer();
    // renderer.heading = function(text, level, raw){
    //   const anchor = tocify.add(text,level);
    //   return `<a id="${anchor}" href="${anchor}" class="anchor-fix"> <h${level}>${text}</h${level}> </a>\n`;
    // }
  // //使用 marked 渲染markdown
  // const renderer = new marked.Renderer();
  // marked.setOptions({
  //   renderer: renderer, // 自定义渲染格式
  //   gfm: true, // 启用类似github的markdown
  //   pedantic: false, // 只解析符合markdown定义的，不修正markdown的错误
  //   sanitize: false, // 忽略html标签，一般填写false
  //   tables: true, // 支持github形式表格，前提gfm开启
  //   breaks: true, // 支持github换行符，前提gfm开启
  //   smartLists: true, // 优化列表输出
  //   smartypants: false,
  //   highlight: function (code) {
  //     return hljs.highlightAuto(code).value;
  //   }
  // })
  // let html = marked(props.article_content)
  // console.log(list)
  return <>
    <Head>
      <title>博客详细页</title>
    </Head>
    <Header />
    <Row className="comm-main" type="flex" justify="center">
      <Col className="comm-left" xs={24} sm={24} md={16} lg={18} xl={14}>
        <div>
          <div className="bread-div">
            <Breadcrumb>
              <Breadcrumb.Item><Link href={{ pathname: "/" }}><a>首页</a></Link></Breadcrumb.Item>
              <Breadcrumb.Item> 视频列表</Breadcrumb.Item>
              <Breadcrumb.Item>xxx</Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <div>
            <div className="detailed-title">
              React实战视频教程
            </div>
            <div className="list-icon center">
              <span><Icon type="calendar" />2019-06-28</span>
              <span><Icon type="folder" />视频教程</span>
              <span><Icon type="fire" />20109人</span>
            </div>
            <div className="detailed-content" >
              {/* <pre dangerouslySetInnerHTML ={{__html:html}}></pre> */}
              <ReactMarkdowm
                source={markdown}
                escapeHtml={false}
              />
            </div>
          </div>
        </div>
      </Col>
      <Col className="comm-right" xs={0} sm={0} md={7} lg={5} xl={4}>
        <Affix offsetTop={5}>
          <div className="detailed-nav comm-box">
            <div className="nav-title">文章目录</div>
            <MarkNav
              className="article-menu"
              source={markdown}
              ordered={false}
            ></MarkNav>
            {/* <div className="toc-list">
              {tocify && tocify.render()}
            </div> */}
          </div>
        </Affix>
      </Col>
    </Row>
  </>
}
Detail.getInitialProps = async (context) => {
  let id = context.query.id
  const promise = new Promise(resolve => {
    axios(servicePath.getArticleById + id).then(res => {
      resolve(res.data);
    })
  })
  return await promise;
}
export default Detail
