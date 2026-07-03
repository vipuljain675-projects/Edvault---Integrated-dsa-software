variable "aws_region" {
  type        = string
  description = "AWS Target Region"
  default     = "us-east-1"
}

variable "db_password" {
  type        = string
  description = "Database administrator password"
  sensitive   = true
}
