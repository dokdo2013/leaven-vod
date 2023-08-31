import VideoCard from "@/components/VideoCard";
import UpdateInfo from "@/constants/update.constant";
import { useGetLive } from "@/fetchers/get-live";
import { useGetVideos } from "@/fetchers/get-videos";
import { getBjInfo, getStreamingLink, showTime } from "@/utils/util";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Flex,
  Heading,
  Image,
  SimpleGrid,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

const IndexPage = () => {
  const { data, error, isLoading } = useGetVideos({
    page: 1,
  });

  const { data: liveBj } = useGetLive("all");
  const mainColor = useColorModeValue("gray.200", "gray.700");

  // 업데이트 일자가 3일 이내
  const hasUpdate = dayjs().diff(dayjs(UpdateInfo[0].date), "day") < 3;

  return (
    <>
      {hasUpdate && (
        <Link href="/intro/update">
          <Alert status="info" flexWrap={"wrap"}>
            <AlertIcon />
            <Text as="span" fontWeight="bold">
              업데이트
            </Text>
            <Text as="span" ml={2}>
              {UpdateInfo[0].title}
            </Text>
            <Text
              as="span"
              ml={2}
              fontSize={"xs"}
              fontWeight={"normal"}
              color={"gray.500"}
            >
              {showTime(UpdateInfo[0].date)}
            </Text>
          </Alert>
        </Link>
      )}
      <Box p={4}>
        {liveBj && liveBj.length > 0 && (
          <Box mb={5}>
            <Heading as="h2" size="md" mb={5}>
              LIVE 방송중!
            </Heading>

            {/* <Flex direction={"row"} mt={2} gap={2} flexWrap={"wrap"}> */}
            <SimpleGrid
              columns={[1, 2, 3, 4, 6, 8]}
              spacing={2}
              // minChildWidth="180px"
              // maxBlockSize={"240px"}
            >
              {liveBj &&
                liveBj.length > 0 &&
                liveBj?.map((bj: any) => (
                  <a
                    href={`${getStreamingLink(
                      getBjInfo(bj?.bj_id)?.provider || "afreeca",
                      bj?.bj_id
                    )}`}
                    target="_blank"
                    className="min-w-[36px] min-h-[36px]"
                    key={bj?.id}
                  >
                    <Flex
                      backgroundColor={mainColor}
                      py={2}
                      px={3}
                      borderRadius="lg"
                      gap={2}
                    >
                      <Image
                        src={getBjInfo(bj?.bj_id)?.profile}
                        alt={getBjInfo(bj?.bj_id)?.name}
                        borderRadius="full"
                        border={"2px solid #f56565"}
                        p={"2px"}
                        width={14}
                        height={14}
                      />
                      <Flex direction={"column"} justify={"space-between"}>
                        <Text fontSize="xs" color="#f56565" fontWeight="bold">
                          LIVE
                        </Text>

                        <Text fontSize="lg" fontWeight={"bold"}>
                          {getBjInfo(bj?.bj_id)?.name}
                        </Text>
                        <Text fontSize="xs">
                          뱅온 {dayjs(bj?.updated_at).format("HH시 mm분")} ~
                        </Text>
                      </Flex>
                    </Flex>
                  </a>
                ))}
              {/* </Flex> */}
            </SimpleGrid>
          </Box>
        )}

        <Heading as="h2" size="md" mb={5}>
          최신 VOD
        </Heading>
        {isLoading && <div>Loading...</div>}
        <SimpleGrid columns={5} spacing={5} minChildWidth="240px">
          {data?.map((video) => (
            <VideoCard key={video.id} {...video} />
          ))}
        </SimpleGrid>
      </Box>
    </>
  );
};

export default IndexPage;
