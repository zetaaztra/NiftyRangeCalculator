pipeline {
    agent any
    
    tools {
        nodejs 'NodeJS14'        // Name of the Node.js installation in Jenkins
        maven 'maven3'           // Name of the Maven installation in Jenkins
    }

    environment {
        SCANNER_HOME = tool 'sonar-scanner'    // Name of the Sonar Scanner tool configured in Jenkins
    }

    stages {

        stage('Install Global npm Packages') {
            steps {
                // Install npm global packages
                sh 'npm install -g http-server yarn pm2 eslint gulp-cli grunt-cli typescript webpack webpack-cli jest nodemon'
            }
        }
    
        stage('GIT CHECKOUT') {
            steps {
                // Clone the repository
                git branch: 'main', url: 'https://github.com/zetaaztra/NiftyRangeCalculator.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                // Install npm dependencies if needed for additional tools
                sh 'yarn install'
            }
        }

        stage('MAVEN CLEAN & COMPILE') {
            steps {
                // Clean and compile the Maven project (though in this case mostly static files)
                sh "mvn clean compile"
            }
        }

        stage('MAVEN TEST') {
            steps {
                // Run tests (if any exist) on the Maven project
                sh "mvn test"
            }
        }
        
        stage('TRIVY FILESYSTEM SCAN') {
            steps {
                // Scan the filesystem for vulnerabilities
                sh "trivy fs --format table -o trivy-fs-report.html ."
            }
        }

        stage('SONARQUBE ANALYSIS') {
            steps {
                // SonarQube code quality analysis
                withSonarQubeEnv('sonar') {
                    sh ''' 
                        $SCANNER_HOME/bin/sonar-scanner \
                        -Dsonar.projectKey=nifty-range-calc \
                        -Dsonar.projectName="Nifty Range Calc by Pravin A Mathew" \
                        -Dsonar.sources=src/main/resources \
                        -Dsonar.language=js \
                        -Dsonar.sourceEncoding=UTF-8 \
                        -Dsonar.java.binaries=.
                    '''
                }
            }
        }

        stage('QUALITY GATE') {
            steps {
                // Wait for SonarQube quality gate status
                script {
                    waitForQualityGate abortPipeline: false, credentialsId: 'sonar-token'
                }
            }
        }

        stage('MAVEN BUILD') {
            steps {
                // Build the Maven project (though it's mostly static files)
                sh "mvn package"
            }
        }
        
        stage('BUILD & TAG DOCKER IMAGE') {
            steps {
                script {
                    // Build and tag the Docker image using the Dockerfile
                    withDockerRegistry(credentialsId: 'docker-cred', toolName: 'docker') {
                        sh "docker build -t nifty-range-calc ."
                    }
                }
            }
        }

        stage('IMAGE SCANNING') {
            steps {
                // Scan the Docker image for vulnerabilities
                sh "trivy image --format table -o trivy-image-report.html nifty-range-calc"
            }
        }
        
        stage('DOCKER DEPLOYMENT') {
            steps {
                // Run the Docker container from the built image
                sh "docker run -d -p 8090:80 nifty-range-calc"
            }
        }
    }
}
