"""coffeeProject URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.10/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.contrib import admin
from coffeeApp.views import index, customConfig, payCart, comDrinkCoffee, recharge, giveCoffee, giveCoffeeDetail, giveCoffeeDetailExe, activityDetail, register, shoppingCart,login,notPay1, myOrder1,apiTest,orderDetail,treat,direct, test,cart,memberCenter,myWallet,nearbyCoffee,activity,notDraw,wechatAttention,drinkCoffee,bottom


urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^index', index, name='index'),
    url(r'^customConfig', customConfig, name='customConfig'),
    url(r'^shoppingCart', shoppingCart, name='shoppingCart'),
    url(r'^apiTest', apiTest, name='apiTest'),
    url(r'^comDrinkCoffee', comDrinkCoffee, name='comDrinkCoffee'),
    url(r'^login/', login, name='login'),
    url(r'^giveCoffee/$', giveCoffee, name='giveCoffee'),
    url(r'^myOrder1', myOrder1, name='myOrder1'),
    url(r'^treat', treat, name='treat'),
    url(r'^direct', direct, name='direct'),
    url(r'giveCoffeeDetail/$', giveCoffeeDetail, name='giveCoffeeDetail'),
    url(r'^givingCoffee/(?P<codeID>\d+)', giveCoffeeDetailExe, name='giveCoffeeDetailExe'),
    url(r'^orderDetail', orderDetail, name='orderDetail'),
    url(r'^ourTest', test, name='test'),
    url(r'^testPay/', notPay1, name='testPay'),
    url(r'^cart/', cart, name='cart'),
    url(r'^payCart/', payCart, name='payCart'),
    url(r'^memberCenter', memberCenter, name='memberCenter'),
    url(r'^myWallet', myWallet, name='myWallet'),
    url(r'^nearbyCoffee', nearbyCoffee, name='nearbyCoffee'),
    url(r'^notDraw', notDraw, name='notDraw'),
    url(r'^wechatAttention', wechatAttention, name='wechatAttention'),
    url(r'^bottom', bottom, name='bottom'),
    url(r'^drinkCoffee', drinkCoffee, name='drinkCoffee'),
    url(r'activity$', activity, name='activity'),
    url(r'^register', register, name='register'),
    url(r'^recharge/', recharge, name='recharge'),
    url(r'activityDetail/(?P<page_num>\d+)', activityDetail, name='activityDetail'),
]
