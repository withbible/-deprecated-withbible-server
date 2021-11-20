# User

{% swagger method="post" path="/user/register" baseUrl="http://210.123.254.17:5000" summary="회원가입" %}
{% swagger-description %}

{% endswagger-description %}

{% swagger-parameter in="body" name="username" required="true" %}

{% endswagger-parameter %}

{% swagger-parameter in="body" name="password" required="true" %}

{% endswagger-parameter %}

{% swagger-parameter in="body" name="name" required="true" %}

{% endswagger-parameter %}

{% swagger-response status="201: Created" description="" %}
```javascript
{
    // Response
}
```
{% endswagger-response %}

{% swagger-response status="401: Unauthorized" description="" %}
```javascript
{
    // Response
}
```
{% endswagger-response %}
{% endswagger %}

{% swagger method="patch" path="/user/login" baseUrl="http://210.123.254.17:5000" summary="로그인" %}
{% swagger-description %}

{% endswagger-description %}

{% swagger-parameter in="body" name="username" required="true" %}

{% endswagger-parameter %}

{% swagger-parameter in="body" name="password" required="true" %}

{% endswagger-parameter %}

{% swagger-response status="204: No Content" description="" %}
```javascript
{
    // Response
}
```
{% endswagger-response %}

{% swagger-response status="401: Unauthorized" description="" %}
```javascript
{
    // Response
}
```
{% endswagger-response %}
{% endswagger %}

{% swagger method="patch" path="/user/logout" baseUrl="http://210.123.254.17:5000" summary="로그아웃" %}
{% swagger-description %}

{% endswagger-description %}

{% swagger-parameter in="cookie" name="session-cookie" %}

{% endswagger-parameter %}

{% swagger-response status="204: No Content" description="" %}
```javascript
{
    // Response
}
```
{% endswagger-response %}

{% swagger-response status="401: Unauthorized" description="" %}
```javascript
{
    // Response
}
```
{% endswagger-response %}
{% endswagger %}

{% swagger method="get" path="/user/me" baseUrl="http://210.123.254.17:5000" summary="로그인 유지" %}
{% swagger-description %}

{% endswagger-description %}

{% swagger-parameter in="cookie" name="session-cookie" required="true" %}

{% endswagger-parameter %}

{% swagger-response status="200: OK" description="" %}
```javascript
{
    // Response
}
```
{% endswagger-response %}

{% swagger-response status="401: Unauthorized" description="" %}
```javascript
{
    // Response
}
```
{% endswagger-response %}
{% endswagger %}

{% swagger method="get" path="/user/totalscore" baseUrl="http://210.123.254.17:5000" summary="챕터단위 모든사용자 기록" %}
{% swagger-description %}

{% endswagger-description %}

{% swagger-parameter in="cookie" name="session-cookie" required="true" %}

{% endswagger-parameter %}

{% swagger-parameter in="path" name="chapterid" %}

{% endswagger-parameter %}

{% swagger-response status="200: OK" description="" %}
```javascript
{
    // Response
}
```
{% endswagger-response %}

{% swagger-response status="400: Bad Request" description="" %}
```javascript
{
    // Response
}
```
{% endswagger-response %}
{% endswagger %}

{% swagger method="patch" path="/user/myscore" baseUrl="http://210.123.254.17:5000" summary="챕터단위 나의기록 수정" %}
{% swagger-description %}

{% endswagger-description %}

{% swagger-parameter in="path" name="chapterid" %}

{% endswagger-parameter %}

{% swagger-parameter in="body" name="sheet" type="Object" required="false" %}

{% endswagger-parameter %}

{% swagger-parameter in="cookie" name="session-cookie" required="true" %}

{% endswagger-parameter %}

{% swagger-response status="200: OK" description="" %}
```javascript
{
    // Response
}
```
{% endswagger-response %}

{% swagger-response status="400: Bad Request" description="" %}
```javascript
{
    // Response
}
```
{% endswagger-response %}
{% endswagger %}

{% swagger method="get" path="/user/myscore" baseUrl="http://210.123.254.17:5000" summary="과목단위 나의기록" %}
{% swagger-description %}

{% endswagger-description %}

{% swagger-parameter in="cookie" name="session-cookie" required="true" %}

{% endswagger-parameter %}

{% swagger-response status="200: OK" description="" %}
```javascript
{
    // Response
}
```
{% endswagger-response %}

{% swagger-response status="500: Internal Server Error" description="" %}
```javascript
{
    // Response
}
```
{% endswagger-response %}
{% endswagger %}

