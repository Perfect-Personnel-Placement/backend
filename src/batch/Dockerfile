# AWS Lambda image for node.js 14
FROM public.ecr.aws/lambda/nodejs:14

# Where to store all of the data
WORKDIR /p3/

# Copy production files to container
COPY ../global ./global

COPY ../package*.json ./

COPY  * ./handler

# Install the required packages
RUN npm install