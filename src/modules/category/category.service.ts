import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateCategoryDto, UpdateCategoryDto } from "./dto/category.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { CategoryEntity } from "./entities/category.entity";
import { DeepPartial, Repository } from "typeorm";
import { S3Service } from "../s3/s3.service";
import { PaginationDto } from "src/common/dto/pagination.dto";
import {
  paginationGenerator,
  paginationSolver,
} from "src/common/utility/pagination.util";

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepo: Repository<CategoryEntity>,
    private s3Service: S3Service
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
    image: Express.Multer.File
  ) {
    const { Key, Location } = await this.s3Service.uploadfile(
      image,
      "clinic-reservation"
    );
    let { description, slug, title } = createCategoryDto;
    const category = await this.findOneBySlug(slug);
    if (category) throw new ConflictException("Category Already Exist");
    await this.categoryRepo.insert({
      title,
      description,
      slug,
      image: Location,
      imageKey: Key,
    });

    return {
      message: "Category Created Successfully",
    };
  }

  async findOneBySlug(slug: string) {
    return await this.categoryRepo.findOneBy({ slug });
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit, page, skip } = paginationSolver(
      paginationDto.page,
      paginationDto.limit
    );
    const [categories, count] = await this.categoryRepo.findAndCount({
      where: {},
      skip,
      take: limit,
      order: { id: "DESC" },
    });

    return {
      pagination: paginationGenerator(count, page, limit),
      categories,
    };
  }

  async findOneById(id: number) {
    const category = await this.categoryRepo.findOneBy({ id });
    if (!category) throw new NotFoundException("Category Not Found");
    return category;
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
    image: Express.Multer.File
  ) {
    const { description, slug, title } = updateCategoryDto;
    const category = await this.findOneById(id);
    const updateObject: DeepPartial<CategoryEntity> = {};
    if (image) {
      const { Key, Location } = await this.s3Service.uploadfile(
        image,
        "clinic-reservation"
      );
      if (Location) {
        updateObject["image"] = Location;
        updateObject["imageKey"] = Key;
        if (category?.imageKey)
          await this.s3Service.deleteFile(category?.imageKey);
      }
    }
    if (title) updateObject["title"] = title;
    if (description) updateObject["description"] = description;
    if (slug) {
      const category = await this.categoryRepo.findOneBy({ slug });
      if (category && category.id !== id)
        throw new ConflictException("Already Exist Category Slug");
      updateObject["slug"] = slug;
    }

    await this.categoryRepo.update({ id }, updateObject);

    return {
      message: "category updated",
    };
  }

  async remove(id: number) {
    await this.findOneById(id);
    await this.categoryRepo.delete({ id });
    return {
      message: "Category Deleted",
    };
  }

  async findBySlug(slug: string) {
    const categories = await this.categoryRepo.findBy({ slug });
    if (!categories) throw new NotFoundException("not found category BySlug");
    return {
      categories,
    };
  }
}
