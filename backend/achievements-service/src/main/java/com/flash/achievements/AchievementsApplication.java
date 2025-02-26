package com.flash.achievements;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@MapperScan({"com.flash.achievements.mapper"})
@EnableDiscoveryClient
@EnableFeignClients
public class AchievementsApplication {

	public static void main(String[] args) {
		SpringApplication.run(AchievementsApplication.class, args);
	}

}
