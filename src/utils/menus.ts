import { IMenu } from '@/types/global';

export const menus: IMenu[] = [
  {
    path: '/chapter2',
    title: 'webGL入门',
    children: [
      { path: '/chapter2/drawRectangle', title: '2维矩形' },
      { path: '/chapter2/helloCanvas', title: 'webgl清空画布' },
      { path: '/chapter2/helloPoint1', title: '画点1' },
      { path: '/chapter2/helloPoint2', title: '画点2(attribute使用)' },
      { path: '/chapter2/clickedPoint', title: '鼠标画点' },
      { path: '/chapter2/coloredPoint', title: '鼠标画点并改变颜色' },
    ],
  },
  {
    path: '/chapter3',
    title: '绘制和变换三角形',
    children: [
      { path: '/chapter3/multiPoints', title: '绘制多个点' },
      { path: '/chapter3/helloTriangle', title: '绘制三角形' },
      { path: '/chapter3/translatedTriangle', title: '平移三角形' },
      { path: '/chapter3/rotatedTriangle', title: '变换三角形' },
    ],
  },
  {
    path: '/chapter4',
    title: '高级变换与动画基础',
    children: [
      {
        path: '/chapter4/rotatedTriangle_Matrix4',
        title: '使用矩阵函数变换三角形',
      },
      {
        path: '/chapter4/rotatedTranslatedTriangle',
        title: '使用矩阵函数平移后旋转三角形',
      },
      { path: '/chapter4/rotatingTriangle', title: '动画基础 - 旋转三角形' },
    ],
  },
  {
    path: '/chapter5',
    title: '颜色与纹理',
    children: [
      { path: '/chapter5/multiAttributeSize', title: '不同尺寸的点' },
      {
        path: '/chapter5/multiAttributeSize_interleaved',
        title: '将非坐标数据传入顶点着色器',
      },
      {
        path: '/chapter5/multiAttributeColor',
        title: '修改颜色 -> 彩色三角形',
      },
      { path: '/chapter5/triangle_FragColor', title: '计算三角形颜色' },
      { path: '/chapter5/texturedQuad', title: '图像纹理' },
      { path: '/chapter5/texturedQuad_Repeat', title: '图像纹理重复填充' },
      { path: '/chapter5/multiTexture', title: '使用多幅纹理' },
    ],
  },
  {
    path: '/chapter7',
    title: '进入三维世界',
    children: [
      { path: '/chapter7/lookAtTriangles', title: '视点和视线' },
      { path: '/chapter7/lookAtTrianglesWithKeys', title: '利用键盘改变视点' },
      { path: '/chapter7/orthoView', title: '正射投影的可视范围' },
      {
        path: '/chapter7/lookAtTrianglesWithKeys_viewVolume',
        title: '随视点变化的正射投影',
      },
      { path: '/chapter7/perspectiveView', title: '透视投影的可视空间' },
      { path: '/chapter7/perspectiveView_mvp', title: '平移绘制透视投影' },
      { path: '/chapter7/helloCubes', title: '立方体' },
      { path: '/chapter7/coloredCube', title: '单面颜色的立方体' },
    ],
  },
  {
    path: '/chapter8',
    title: '光照',
    children: [
      { path: '/chapter8/lightedCube', title: '光照原理' },
      {
        path: '/chapter8/lightedTranslatedRotatedCube',
        title: '运动物体的光照效果',
      },
      { path: '/chapter8/pointLightedCube', title: '点光源光照' },
      { path: '/chapter8/pointLightedCube_animation', title: '运动中的点光源光照' },
    ],
  },
  {
    path: '/chapter9',
    title: '层次模型',
    children: [
      { path: '/chapter9/pointModel', title: '单节点模型' },
      { path: '/chapter9/multiJointModel', title: '多节点模型' },
      { path: '/chapter9/multiJointModel_segment', title: '多节点模型绘制部件' },
    ],
  },
];
