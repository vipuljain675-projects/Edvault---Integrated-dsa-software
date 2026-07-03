output "alb_dns_name" {
  value       = aws_lb.alb.dns_name
  description = "The URL of the application load balancer (EduVault live endpoint)"
}

output "rds_endpoint" {
  value       = aws_db_instance.db.endpoint
  description = "Database connection endpoint"
}
