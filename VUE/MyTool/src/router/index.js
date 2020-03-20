import Vue from 'vue'
import Router from 'vue-router'
import HOME from '@/components/HOME'
import LOGIN from '@/components/Login'
import WORK1 from '@/components/Work1'
import HomeView from '@/components/HomeView'
//import Silde from '@/components/Common/Silde';

Vue.use(Router)

export default new Router({
  mode:'history',
  base:'/DTW/',
  routes: [
    {
      path: '/',
      name: 'LOGIN',
      title:"歡迎來到東方神秘世界",
      component: LOGIN
    }, 
    {
      path: '/LOGIN/:IsLogin',
      name: 'LOGIN',
      title:"歡迎來到東方神秘世界",
      component: LOGIN
    }, 
     {
      path: '*',
      redirect: '/',
    }, 
    {
      path: '/HOME',
      name: 'HomeView',
      title:"東方神秘世界",
      components: {
        default:HOME,
       // nav: Silde
      },
      children:[
        {
          path: 'Work1',
          name: 'Work1',
          title:"東方神秘世界",
          component: WORK1

        },
        {
          path: '',
          name: 'HomeView',
          title:"東方神秘世界",
          component: HomeView
        }
      ],
    },
    // 綁定 HardenDown 組件到 /down 路徑上
    /*{
      path: '/TEST',
      name: 'TEST',
      component: TEST
    },
    // 綁定 HardenDown 組件到 /down 路徑上
    {
      path: '/TEST',
      name: 'TEST',
      component: TEST
    }*/
  ]
})