from django.shortcuts import render, HttpResponse

# Create your views here.
def test(request):
    index_page = render(request, 'test.html')
    return index_page

def index(request):
    queryset = request.GET.get('code')
    context = {}
    context['queryset'] = queryset
    index_page = render(request, 'drinkCoffee.html',context)
    return index_page

def customConfig(request):
    customConfig_page = render(request, 'customConfig.html')
    return customConfig_page

def payCart(request):
    payCart_page = render(request, 'payCart.html')
    return payCart_page

def  register(request):
    register_page = render(request, 'register.html')
    return register_page

def shoppingCart(request):
    shoppingCart_page = render(request, 'shoppingCart.html')
    return shoppingCart_page

def notPay1(request):
    notPay1_page = render(request, 'notPay.html')
    return notPay1_page
def treat(request):
    treat_page = render(request, 'treat.html')
    return treat_page
def apiTest(request):
    apiTest_page = render(request, 'apiTest.html')
    return apiTest_page
def myOrder1(request):
    myOrder1_page = render(request, 'myOrder1.html')
    return myOrder1_page
def login(request):
    login_page = render(request, 'login.html')
    return login_page

def direct(request):
    direct_page = render(request, 'direct.html')
    return direct_page

def orderDetail(request):
    queryset = request.GET.get('orderId')
    context = {}
    context['queryset'] = queryset
    orderDetail_page = render(request, 'orderDetail.html',context)
    return orderDetail_page
def cart(request):
    cart_page = render(request, 'cart.html')
    return cart_page
def memberCenter(request):
    queryset = request.GET.get('code')
    context = {}
    context['queryset'] = queryset
    memberCenter_page = render(request, 'memberCenter.html', context)
    return memberCenter_page
def myWallet(request):
    myWallet_page = render(request, 'myWallet.html')
    return myWallet_page

def recharge(request):
    recharge_page = render(request, 'recharge.html')
    return recharge_page

def nearbyCoffee(request):
   nearbyCoffee_page = render(request, 'nearbyCoffee.html')
   return nearbyCoffee_page

def notDraw(request):
	notDraw_page = render(request, 'notDraw.html')
	return notDraw_page

def activityDetail(request,page_num):
    queryset = request.GET.get('parm')
    context = {}
    context['queryset'] = queryset
    context['queryset2'] = page_num
    activityDetail_page = render(request, 'activityDetail.html', context)
    return activityDetail_page

def activity(request):
    activity_page = render(request, 'activity.html')
    return activity_page

def wechatAttention(request):
	wechatAttention_page = render(request, 'wechatAttention.html')
	return wechatAttention_page
def bottom(request):
	bottom_page = render(request, 'bottom.html')
	return bottom_page
def drinkCoffee(request):
	drinkCoffee_page = render(request, 'drinkCoffee.html')
	return drinkCoffee_page

def comDrinkCoffee(request):
	comDrinkCoffee_page = render(request, 'comDrinkCoffee.html')
	return comDrinkCoffee_page

def giveCoffee(request):
	giveCoffee_page = render(request, 'giveCoffee.html')
	return giveCoffee_page

def giveCoffeeDetail(request):
    giveCoffeeDetail_page = render(request, 'giveCoffeeDetail.html')
    return giveCoffeeDetail_page

def giveCoffeeDetailExe(request,codeID):
    context = {}
    context['queryset'] = codeID
    giveCoffeeDetailExe_page = render(request, 'exe_giveCoffee.html', context)
    return giveCoffeeDetailExe_page
