package com.flash.achievements.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.flash.achievements.dao.User;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper extends BaseMapper<User> {
}
