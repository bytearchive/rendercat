FROM ubuntu:14.04
MAINTAINER Neil Ellis neil@cazcade.com

# Set working directory.
ENV HOME /root
WORKDIR /root

# Env
ENV SLIMERJS_VERSION_M 0.9
ENV SLIMERJS_VERSION_F 0.9.0
ENV PHANTOM_VERSION 1.9.7

# Update OS.
RUN echo "deb http://archive.ubuntu.com/ubuntu trusty multiverse" >> /etc/apt/sources.list
RUN echo "deb http://archive.ubuntu.com/ubuntu trusty-updates multiverse" >> /etc/apt/sources.list
RUN echo "deb http://archive.ubuntu.com/ubuntu trusty-security multiverse" >> /etc/apt/sources.list
RUN apt-get update

# Required directories
RUN mkdir -p /usr/local
RUN mkdir /data
RUN mkdir /app

#Nasty Downloads
RUN mkdir ~/fonts/
RUN apt-get install -y curl
RUN curl http://rendercatdeps.s3-website-us-east-1.amazonaws.com/fonts.tgz > ~/fonts/fonts.tgz
RUN curl http://rendercatdeps.s3-website-us-east-1.amazonaws.com/google.zip > ~/fonts/google.zip
RUN curl http://rendercatdeps.s3-website-us-east-1.amazonaws.com/phantomjs-${PHANTOM_VERSION}-linux-x86_64.tar.bz2 > /tmp/phantomjs-${PHANTOM_VERSION}-linux-x86_64.tar.bz2

#NodeJS
RUN apt-get install -y make gcc g++ wget python software-properties-common
RUN \
  cd /tmp && \
  wget http://nodejs.org/dist/node-latest.tar.gz && \
  tar xvzf node-latest.tar.gz && \
  rm -f node-latest.tar.gz && \
  cd node-v* && \
  ./configure && \
  CXX="g++ -Wno-unused-local-typedefs" make && \
  CXX="g++ -Wno-unused-local-typedefs" make install && \
  cd /tmp && \
  rm -rf /tmp/node-v* && \
  echo '\n# Node.js\nexport PATH="node_modules/.bin:$PATH"' >> /root/.bashrc


# Install basic packages.
RUN apt-get install -y  python-urllib3  perl-base perl libc6  dbus libdbus-glib-1-2  bzip2 git htop unzip vim git-core xvfb timelimit psmisc graphicsmagick openssh-server fail2ban

#Fonts
RUN yes |  apt-get install -y msttcorefonts
RUN  apt-get install -y freetype*
RUN  apt-get install -y fonts-cantarell lmodern ttf-aenigma ttf-georgewilliams ttf-bitstream-vera ttf-sjfonts ttf-tuffy tv-fonts ubuntustudio-font-meta
#ADD bin/install-google-fonts.sh ./
#RUN chmod 755 install-google-fonts.sh
#RUN ./install-google-fonts.sh
RUN fc-cache -fv




## CasperJS
# RUN git clone https://github.com/n1k0/casperjs.git /usr/local/casperjs
# RUN echo '#!/bin/bash\n/usr/local/casperjs/bin/casperjs --engine=slimerjs $*' > /usr/local/casperjs/casperjs.sh
# RUN chmod 755 /usr/local/casperjs/casperjs.sh
# RUN ln -s /usr/local/casperjs/casperjs.sh /usr/bin/casperjs


##For polling and running
#RUN  apt-get -y update
#RUN  apt-get install -y redis-server moreutils
#RUN  rm /etc/parallel/config

#Etc
#ADD lib/render.js /usr/local/snapito/lib/

#Flash
RUN  apt-get install -y flashplugin-installer

#CutyCapt
RUN  apt-get install -y cutycapt

# PhantomJS
RUN apt-get install -y libfreetype6 libfontconfig1
RUN tar -xjvf /tmp/phantomjs-${PHANTOM_VERSION}-linux-x86_64.tar.bz2
RUN mv phantomjs-${PHANTOM_VERSION}-linux-x86_64 /usr/local/phantomjs-${PHANTOM_VERSION}-linux-x86_64
#ADD http://rendercatdeps.s3-website-us-east-1.amazonaws.com/phantomjs-1-9-webfonts /usr/local/phantomjs-${PHANTOM_VERSION}-linux-x86_64/bin/phantomjs
RUN ln -s /usr/local/phantomjs-${PHANTOM_VERSION}-linux-x86_64/bin/phantomjs /usr/local/bin/phantomjs
RUN chmod 755 /usr/local/phantomjs-${PHANTOM_VERSION}-linux-x86_64/bin/phantomjs


#Git Related
RUN curl https://raw.githubusercontent.com/progrium/gitreceive/master/gitreceive > /usr/local/bin/gitreceive
RUN chmod 755 /usr/local/bin/gitreceive
RUN /usr/local/bin/gitreceive init


#Xvfbd
ADD bin/xvfb /etc/init.d/xvfb
RUN chmod +x /etc/init.d/xvfb
RUN update-rc.d xvfb defaults

# Install Nginx

# Download and Install Nginx
RUN apt-get install -y nginx

# Remove the default Nginx configuration file
RUN rm -v /etc/nginx/nginx.conf


# Removed unnecessary packages
RUN apt-get autoremove -y

# Clear package repository cache
RUN apt-get clean all



# Copy a configuration file from the current directory
ADD etc/nginx.conf /etc/nginx/

# Append "daemon off;" to the beginning of the configuration
RUN echo "daemon off;" >> /etc/nginx/nginx.conf


WORKDIR /app
ADD . /app
RUN chmod 755 ./run.sh
RUN npm install
RUN node gulpfile.js
RUN npm install forever -g
EXPOSE 80
#CMD forever --watchDirectory rendercat_modules app.js
CMD ./run.sh
