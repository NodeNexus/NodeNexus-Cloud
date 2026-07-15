import paramiko
import time
import sys

sys.stdout.reconfigure(encoding='utf-8')

hostname = "vnavhomelab.local"
username = "vnavhomelab"
password = "1234"
project_dir = "VNAV-WEB-SERVIES"
branch = "dev"  # Assuming we are deploying the dev branch

def deploy_to_pi():
    print(f"🚀 Starting deployment to {hostname}...")
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        print("🔌 Connecting via SSH...")
        ssh.connect(hostname, username=username, password=password, timeout=10)
    except Exception as e:
        print(f"❌ Failed to connect to {hostname}: {e}", file=sys.stderr)
        sys.exit(1)

    commands = [
        f"cd {project_dir} && git fetch origin",
        f"cd {project_dir} && git reset --hard origin/{branch}",
        f"cd {project_dir} && docker compose up -d --build"
    ]

    for cmd in commands:
        print(f"⏳ Executing: {cmd}")
        stdin, stdout, stderr = ssh.exec_command(cmd)
        
        # Stream the output so it doesn't just hang silently
        while not stdout.channel.exit_status_ready():
            if stdout.channel.recv_ready():
                print(stdout.channel.recv(1024).decode('utf-8', errors='ignore'), end="")
            if stderr.channel.recv_stderr_ready():
                print(stderr.channel.recv_stderr(1024).decode('utf-8', errors='ignore'), end="", file=sys.stderr)
            time.sleep(0.1)

        # Flush any remaining output
        print(stdout.read().decode('utf-8', errors='ignore'), end="")
        err = stderr.read().decode('utf-8', errors='ignore')
        if err:
            print(err, end="", file=sys.stderr)

        status = stdout.channel.recv_exit_status()
        if status != 0:
            print(f"\n❌ Command failed with exit code {status}")
            ssh.close()
            sys.exit(status)
            
    print("\n✅ Deployment completed successfully!")
    ssh.close()

if __name__ == "__main__":
    deploy_to_pi()
