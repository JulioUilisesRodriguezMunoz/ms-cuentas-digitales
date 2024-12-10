pipeline {
	agent any
	tools {
		nodejs "Node 14.14.0"
	}
	stages {
		stage('Preparation') {
			steps {
      	echo "Will deploy to ${NAME_APP}"
				sh 'rm -Rf .git/'
				sh 'rm -Rf .vscode/'
			}
		}
		stage('Create  Manifest') {
			steps {
				sh "python script.py"
			}
		}
		stage ('Deliver for Feature CF') {
			steps {
				pushToCloudFoundry(
					target: "${CF_TARGET}",
					organization: "${CF_ORGANIZATION}",
					cloudSpace: "${CF_CLOUDSPACE}",
					credentialsId: "${CF_CREDENTIALS_ID}",
					selfSigned: 'true',
					manifestChoice: [
						manifestFile: './manifest.yml'
					]
				)
			}
    }
	}
}