import { UserChallengeListItemSkeleton } from "./user-challenge-list-item-skeleton";

export const UserChallengeListSkeleton = () => {
  return (
    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
      {Array.from({ length: 6 }).map((_, index) => (
        <UserChallengeListItemSkeleton key={index} />
      ))}
    </div>
  );
};
