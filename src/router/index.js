import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'dashboard', icon: 'dashboard', affix: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/products',
    component: Layout,
    redirect: '/products/product/index',
    alwaysShow: true, // will always show the root menu
    name: 'Product',
    meta: {
      title: 'product',
      icon: 'productmenu'
    },
    children: [
      {
        path: 'product/index',
        component: () => import('@/views/products/product/index'),
        name: 'IndexProduct',
        meta: {
          title: '商品列表',
          icon: 'product'
        }
      },
      {
        path: 'product/create',
        component: () => import('@/views/products/product/create'),
        name: 'CreateProduct',
        meta: {
          title: '添加商品',
          icon: 'guide'
        }
      },
      {
        path: 'brand/index',
        component: () => import('@/views/products/brand/index'),
        name: 'IndexBrand',
        meta: {
          title: '品牌列表',
          icon: 'brand'
        }
      },
      {
        path: 'brand/create/:id(\\d+)',
        component: () => import('@/views/products/brand/create'),
        name: 'ModifyBrand',
        meta: {
          title: '编辑品牌'
        },
        hidden:true
      },
      {
        path: 'category/index',
        component: () => import('@/views/products/category/index'),
        name: 'IndexCategory',
        meta: {
          title: '分类列表',
          icon: 'category'
        }
      },
      {
        path: 'category/create/:id(\\d+)',
        component: () => import('@/views/products/category/create'),
        name: 'ModifyCategory',
        meta: {
          title: '编辑分类'
        },
        hidden:true
      }
    ]
  },
  {
    path: '/oms',
    component: Layout,
    redirect: '/oms/order/index',
    alwaysShow: true, // will always show the root menu
    name: 'Order',
    meta: {
      title: '订单管理',
      icon: 'orderlist'
    },
    children: [
      {
        path: 'order/index',
        component: () => import('@/views/oms/order/index'),
        name: 'IndexOrder',
        meta: {
          title: '订单列表',
          icon: 'ordermenu'
        }
      },
      {
        path: 'order/detail/:id(\\d+)',
        name: 'OrderDetail',
        component: () => import('@/views/oms/order/detail'),
        meta: {title: '订单详情'},
        hidden:true
      },
      {
        path: 'return/index',
        component: () => import('@/views/oms/return/index'),
        name: 'ReturnOrder',
        meta: {
          title: '退货申请',
          icon: 'return'
        }
      },
      {
        path: 'return/detail/:id(\\d+)',
        name: 'ReturnDetail',
        component: () => import('@/views/oms/return/detail'),
        meta: {title: '退货详情'},
        hidden:true
      },
      {
        path: 'return/reason',
        component: () => import('@/views/oms/return/reason'),
        name: 'ReturnReason',
        meta: {
          title: '退货原因',
          icon: 'skill'
        }
      }
    ]
  },
  {
    path: '/marketing',
    component: Layout,
    redirect: '/marketing/coupon/index',
    alwaysShow: true, // will always show the root menu
    name: 'Marketing',
    meta: {
      title: '营销管理',
      icon: 'marketingmenu'
    },
    children: [
      {
        path: 'coupon/index',
        component: () => import('@/views/marketing/coupon/index'),
        name: 'IndexCoupon',
        meta: {
          title: '优惠券列表',
          icon: 'coupon'
        }
      },
      {
        path: 'coupon/detail/:id(\\d+)',
        component: () => import('@/views/marketing/coupon/detail'),
        name: 'DetailCoupon',
        meta: {
          title: '优惠券详情'
        },
        hidden:true
      },
      {
        path: 'coupon/create/:id(\\d+)',
        component: () => import('@/views/marketing/coupon/create'),
        name: 'ModifyCoupon',
        meta: {
          title: '编辑优惠券'
        },
        hidden:true
      },
      {
        path: 'promotion/index',
        component: () => import('@/views/marketing/promotion/index'),
        name: 'IndexPromotion',
        meta: {
          title: '活动列表',
          icon: 'promotion'
        }
      },
      {
        path: 'promotion/detail/:id(\\d+)',
        component: () => import('@/views/marketing/promotion/detail'),
        name: 'DetailPromotion',
        meta: {
          title: '活动详情'
        },
        hidden:true
      },
      {
        path: 'promotion/create/:id(\\d+)',
        component: () => import('@/views/marketing/promotion/create'),
        name: 'ModifyPromotion',
        meta: {
          title: '编辑活动'
        },
        hidden:true
      }
    ]
  },
  {
    path: '/member',
    component: Layout,
    redirect: '/member/member/index',
    alwaysShow: true, // will always show the root menu
    name: 'Member',
    meta: {
      title: '会员管理',
      icon: 'membermenu'
    },
    children: [
      {
        path: 'member/index',
        component: () => import('@/views/members/member/index'),
        name: 'IndexMember',
        meta: {
          title: '会员列表',
          icon: 'member'
        }
      },
      {
        path: 'member/level',
        component: () => import('@/views/members/level/index'),
        name: 'IndexLevelConfig',
        meta: {
          title: '会员等级',
          icon: 'memberlevel'
        }
      },
      {
        path: 'member/create/:id(\\d+)',
        component: () => import('@/views/members/level/create'),
        name: 'IndexLevelCreate',
        meta: {
          title: '编辑会员等级'
        },
        hidden:true
      },
      {
        path: 'member/detail/:id(\\d+)',
        component: () => import('@/views/members/member/detail'),
        name: 'DetailMember',
        meta: {
          title: '会员详情'
        },
        hidden:true
      }
    ]
  },
  {
    path: '/distribution',
    component: Layout,
    redirect: '/distribution/distributor/index',
    alwaysShow: true, // will always show the root menu
    name: 'Distribution',
    meta: {
      title: '分销管理',
      icon: 'distrmenu'
    },
    children: [
      {
        path: 'distributor/index',
        component: () => import('@/views/distribution/distributor/index'),
        name: 'IndexDistributor',
        meta: {
          title: '分销员列表',
          icon: 'distributor'
        }
      },
      {
        path: 'distributor/detail/:id(\\d+)',
        name: 'ShopDetail',
        component: () => import('@/views/distribution/distributor/detail'),
        meta: {title: '分销员详情'},
        hidden:true
      },
      {
        path: 'distributor/apply',
        component: () => import('@/views/distribution/distributor/apply'),
        name: 'DistributorApply',
        meta: {
          title: '分销员申请',
          icon: 'distrapply'
        }
      },
      {
        path: 'setting/index',
        component: () => import('@/views/distribution/setting/index'),
        name: 'DistributorSetting',
        meta: {
          title: '分销规则配置',
          icon: 'distrconfig'
        }
      },
      {
        path: 'setting/level/:id(\\d+)',
        component: () => import('@/views/distribution/setting/level'),
        name: 'DistributorLevel',
        meta: {title: '编辑分销等级'},
        hidden:true
      },
      {
        path: 'setting/commission/:id(\\d+)',
        component: () => import('@/views/distribution/setting/commission'),
        name: 'DistributorCommission',
        meta: {title: '编辑销售返点'},
        hidden:true
      }
    ]
  },
  {
    path: '/settings',
    redirect: '/settings/setting/index',
    alwaysShow: true, // will always show the root menu
    name: 'Distribution',
    meta: {
      title: '系统设置',
      icon: 'setting'
    },
    component: Layout,
    children: [
      {
        path: 'merchant',
        component: () => import('@/views/settings/merchant'),
        name: 'MerchantConfig',
        meta: { title: '商户设置', icon: 'config' }
      },
      {
        path: 'system',
        component: () => import('@/views/settings/system'),
        name: 'SystemConfig',
        meta: { title: '系统配置', icon: 'system' }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
