# Wetube Reloaded

# Route를 만들기 전 어떤 루트가 있을지 계획을 짜는 중

# 도메인 별로 나누자

# Home은 글로벌 라우터

# 일부 라우트는 url창을 더 깔끔히 만들기 위해 예외를 만들기도 한다

/ -> home
/join -<> Join 
/login -> Login 
/search -> Search 

/users/:id -> See User
/users/logout -> Log Out
/users/edit -> Edit My Profile
/users/delete-> Delete User 

/videos/:id -> Watch Video
/videos/:id/edit -> Edit Video
/videos/:id/delete -> Delete Video
/videos/upload -> Upload Video

/videos/comments -> Write comment
/videos/comments/delete -> Delete comment
