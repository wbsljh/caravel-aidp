touch /etc/yum.repos.d/nginx.repo
echo [nginx] > /etc/yum.repos.d/nginx.repo
echo name=nginx repo > /etc/yum.repos.d/nginx.repo
echo baseurl=http://nginx.org/packages/centos/$releasever/$basearch/ > /etc/yum.repos.d/nginx.repo
echo gpgcheck=0 > /etc/yum.repos.d/nginx.repo
echo enabled=1 > /etc/yum.repos.d/nginx.repo
